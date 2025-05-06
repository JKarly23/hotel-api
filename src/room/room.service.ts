import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { RoomStatus } from './types/room.enum';

@Injectable()
export class RoomService {
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
      const roomsWithFullUrl = rooms.map((room) => ({
        ...room,
        img: room.img
          ? `${process.env.BASE_URL || 'http://localhost:3001'}/public${room.img}`
          : null,
      }));
      return {
        rooms: roomsWithFullUrl,
        total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.handleDbError(error);
    }
  }

  async findOne(id: string) {
    const room = await this.roomRepository.findOneBy({ id });
    if (!room) throw new NotFoundException('Habitacion no encontrada');
    return {
      ...room,
      img: room.img
        ? `${process.env.BASE_URL || 'http://localhost:3001'}/public${room.img}`
        : null,
    };
  }

  async findRoomsAvailable() {
    const data = await this.roomRepository.find({
      where: { status: RoomStatus.AVAILABLE },
    });
    return data.map((room) => ({
      ...room,
      img: room.img
        ? `${process.env.BASE_URL || 'http://localhost:3001'}/public${room.img}`
        : null,
    }));
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepository.preload({ id, ...updateRoomDto });
    if (!room) throw new NotFoundException('Room not found');
    return await this.roomRepository.save(room);
  }

  async remove(id: string) {
    const resp = await this.roomRepository.delete(id);
    if (resp.affected === 0)
      throw new NotFoundException(`Room with id "${id}" not found`);
    return {
      message: `Room with id "${id}" deleted`,
      status: 200,
    };
  }

  handleDbError(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.message);
    throw new InternalServerErrorException(
      'Ha ocurrido un error inesperado',
      error.message,
    );
  }
}
