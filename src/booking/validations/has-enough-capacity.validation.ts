import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomService } from 'src/room/room.service';

/**
 * Service class to validate if a room has enough capacity for a given number of guests
 */
@Injectable()
export class HasEnoughCapacityValidation {
  /**
   * Creates an instance of HasEnoughCapacityValidation
   * @param roomService - Service to handle room-related operations
   */
  constructor(private readonly roomService: RoomService) {}

  /**
   * Validates if a room has enough capacity for the specified number of guests
   * @param id - The unique identifier of the room
   * @param guests - Number of guests to check capacity for
   * @returns Object containing validation result and message
   * @throws NotFoundException if the room is not found
   */
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
