import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Booking } from 'src/booking/entities/booking.entity';
import { BookingStatus } from 'src/booking/types/booking.enum';
import { RoomStatus } from 'src/room/types/room.enum';
import { Repository, IsNull, LessThan, LessThanOrEqual } from 'typeorm';

/**
 * Service responsible for handling automated booking-related tasks
 * Uses cron jobs to periodically check and update booking statuses
 */
@Injectable()
export class BookingTask {
  logger = new Logger('BookingTask');

  /**
   * Creates an instance of BookingTask service
   * @param bookingRepository - Repository for handling booking entities
   */
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  /**
   * Automatically marks bookings as "no show" if guests haven't checked in by checkout date
   * Runs every day at midnight
   * Updates both booking status and room availability
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async markNoShows() {
    const now = new Date();
    const bookings = await this.bookingRepository.find({
      where: {
        status: BookingStatus.CONFIRMED,
        actualCheckIn: IsNull(),
        checkOutDate: LessThan(now),
      },
    });
    for (const booking of bookings) {
      booking.status = BookingStatus.NO_SHOW;
      booking.room.status = RoomStatus.AVAILABLE;
      booking.checkInDate = null;
      booking.checkOutDate = null;
      booking.paymentStatus = null;
      booking.totalPrice = null;
      await this.bookingRepository.manager.transaction(async (manager) => {
        await manager.save(booking.room);
        await manager.save(booking);
      });
      this.logger.log(`Mark ${booking.id} as no show`);
    }
  }

  /**
   * Automatically marks bookings as checked out when checkout date has passed
   * Runs every day at midnight
   * Updates booking status to CHECKED_OUT and marks room as AVAILABLE
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async bookingsToFinished() {
    const now = new Date();
    const bookings = await this.bookingRepository.find({
      where: {
        checkOutDate: LessThanOrEqual(now),
        actualCheckOut: IsNull(),
        status: BookingStatus.CHECKED_IN,
      },
    });
    for (const booking of bookings) {
      booking.status = BookingStatus.CHECKED_OUT;
      booking.room.status = RoomStatus.AVAILABLE;
      await this.bookingRepository.manager.transaction(async (manager) => {
        await manager.save(booking.room);
        await manager.save(booking);
      });
    }
  }
}
