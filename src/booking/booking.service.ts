import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { BookingValidate, RoomAvailableForRangeDates } from './validations';
import { Auth } from 'src/auth/entities/auth.entity';
import { Room } from 'src/room/entities/room.entity';
import { RoomStatus } from 'src/room/types/room.enum';
import { BookingStatus } from './types/booking.enum';

@Injectable()
export class BookingService {
  logger = new Logger('BookingService');
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly bookingValidate: BookingValidate,
    private readonly roomAvailable: RoomAvailableForRangeDates,
  ) {}

  async create(payload: CreateBookingDto) {
    const { userId, roomId } = payload;
    const price = await this.bookingValidate.validateBooking(payload);
    const queryRunner =
      this.bookingRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const [user, room] = await Promise.all([
        queryRunner.manager.findOneBy(Auth, { id: userId }),
        queryRunner.manager.findOneBy(Room, { id: roomId }),
      ]);
      if (!user || !room) throw new NotFoundException('User or room not found');

      const booking = queryRunner.manager.create(Booking, {
        ...payload,
        totalPrice: price,
        user,
        room,
      });

      await queryRunner.manager.save(Booking, booking);

      room.status = RoomStatus.RESERVED;
      await queryRunner.manager.save(Room, room);

      await queryRunner.commitTransaction();
      return booking;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e);
    } finally {
      await queryRunner.release();
    }
  }

  private mapBookingData(booking: Booking) {
    return {
      ...booking,
      room: booking.room?.number,
      user: booking.user?.name,
    };
  }

  async findAll(page = 1, limit = 15) {
    const [bookings, total] = await this.bookingRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { checkInDate: 'DESC' },
      relations: ['room', 'user'],
    });
    return {
      bookings: bookings.map(this.mapBookingData),
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllByUser(userId: string) {
    const bookings = await this.bookingRepository.find({
      where: { user: { id: userId } },
      order: { checkInDate: 'DESC' },
      relations: ['room', 'user'],
    });
    if (!bookings.length)
      throw new NotFoundException('Bookings not found for the user');
    return bookings.map(this.mapBookingData);
  }

  async findAllByRoom(roomId: string) {
    const bookings = await this.bookingRepository.find({
      where: { room: { id: roomId } },
      relations: ['room', 'user'],
    });
    if (!bookings.length)
      throw new NotFoundException('Bookings not found for the room');
    return bookings.map(this.mapBookingData);
  }

  async findAllData() {
    return await this.bookingRepository.find();
  }

  async findOne(id: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['room', 'user'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return this.mapBookingData(booking);
  }

  async checkIn(id: string) {
    const queryRunner =
      this.bookingRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const booking = await queryRunner.manager.findOneBy(Booking, { id });
      if (!booking) throw new NotFoundException('Booking not found');
      const now = new Date();
      const checkInDate = new Date(booking.checkInDate);
      if (now < checkInDate)
        throw new BadRequestException('Booking is not today or late');
      booking.actualCheckIn = now;
      booking.status = BookingStatus.CONFIRMED;
      booking.room.status = RoomStatus.RESERVED;
      await queryRunner.manager.save(Booking, booking);
      await queryRunner.manager.save(Room, booking.room);
      await queryRunner.commitTransaction();
      return booking;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async checkOut(id: string) {
    const queryRunner =
      this.bookingRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const booking = await queryRunner.manager.findOneBy(Booking, { id });
      if (!booking) throw new NotFoundException('Booking not found');
      booking.actualCheckOut = new Date();
      booking.status = BookingStatus.CHECKED_OUT;
      booking.room.status = RoomStatus.AVAILABLE;
      await queryRunner.manager.save(Booking, booking);
      await queryRunner.manager.save(Room, booking.room);
      await queryRunner.commitTransaction();
      return booking;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    try {
      const booking = await this.bookingRepository.findOne({
        where: { id },
        relations: ['room', 'user'],
      });
      if (!booking)
        throw new NotFoundException(`Booking with id ${id} not found`);

      const { roomId, checkInDate, checkOutDate } = updateBookingDto;
      if (roomId && checkInDate && checkOutDate) {
        const { isValid } = await this.roomAvailable.roomAvailableForRangeDates(
          roomId,
          checkInDate,
          checkOutDate
        );
        if (!isValid)
          throw new BadRequestException(
            'Room is not available for the given dates',
          );
      }
      const entityToUpdate = this.bookingRepository.merge(
        booking,
        updateBookingDto,
      );
      if (!entityToUpdate)
        throw new NotFoundException(`Booking with id ${id} not found`);
      return await this.bookingRepository.save(entityToUpdate);
    } catch (error) {
      throw new BadRequestException(
        error.message || `Error updating booking with id: ${id}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const result = await this.bookingRepository.delete(id);
      if (result.affected === 0)
        throw new NotFoundException('Booking not found');
      return { code: 200, message: 'Booking deleted successfully' };
    } catch (error) {
      throw new BadRequestException(`Error deleting booking with id: ${id}`);
    }
  }
}
