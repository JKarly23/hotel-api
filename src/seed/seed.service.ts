import { Injectable } from '@nestjs/common';
import { RoomService } from 'src/room/room.service';
import { roomsData } from './data/rooms.data';
import { Room } from 'src/room/entities/room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private readonly roomService: RoomService,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}
  async runSeedRooms() {
    await this.roomRepository.delete({});
    try {
      const rooms = await Promise.all(
        roomsData.map(async (room) => this.roomService.create(room)),
      );
      return {
        message: `Rooms seeded successfully, inserted (${rooms.length} rooms)`,
        code: 200,
        rooms: rooms.map((room) => ({
          ...room,
          img: !room?.img.startsWith('https')
            ? `${process.env.BASE_URL || 'http://localhost:3001'}/public${room?.img}`
            : room.img,
        })),
      };
    } catch (e) {
      return {
        message: 'Error seeding rooms',
        code: e.code,
      };
    }
  }
}
