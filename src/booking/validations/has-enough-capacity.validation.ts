import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class HasEnoughCapacityValidation {
  constructor(private readonly roomService: RoomService) {}
  async hasEnoughCapacity(
    id: string,
    guests: number,
  ): Promise<{ isValid: boolean; message: string }> {
    const room = await this.roomService.findOne(id);
    if (!room) throw new NotFoundException('Room not found');
    return {
      isValid: room.capacity >= guests,
      message:
        room.capacity < guests ? 'Room does not have enough capacity' : '',
    };
  }
}
