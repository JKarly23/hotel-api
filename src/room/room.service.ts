import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomStatus } from './types/room.enum';
import { roomsData } from 'src/seed/data/rooms.data';

@Injectable()
export class RoomService {
  logger = new Logger('RoomService');
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    try {
      const room = this.roomRepository.create(createRoomDto);
      return await this.roomRepository.save(room);
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const [rooms, total] = await this.roomRepository.findAndCount({
        take: limit,
        skip: (page - 1) * limit,
        order: { number: 'ASC' },
      });

      return {
        rooms,
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async findAllData() {
    const rooms = await this.roomRepository.find({
      relations: ['bookings'],
    });
    return rooms;
  }

  async findOne(id: string) {
    const room = await this.roomRepository.findOneBy({ id });
    if (!room) throw new NotFoundException('Habitacion no encontrada');
    return room;
  }

  async findRoomsAvailable() {
    const data = await this.roomRepository.find({
      where: { status: RoomStatus.AVAILABLE },
    });
    return data;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepository.preload({ id, ...updateRoomDto });
    if (!room) throw new NotFoundException('Room not found');
    return await this.roomRepository.save(room);
  }

  async remove(id: string) {
    try {
      const resp = await this.roomRepository.delete(id);
      if (resp.affected === 0)
        throw new NotFoundException(`Room with id "${id}" not found`);
      return {
        message: `Room with id "${id}" deleted`,
        code: HttpStatus.OK,
      };
    } catch (error) {
      this.handleDbError(error);
    }
  }

  handleDbError(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.message);
    throw new InternalServerErrorException(
      'Ha ocurrido un error inesperado',
      error.message,
    );
  }
}
