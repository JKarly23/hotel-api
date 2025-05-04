import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoomService } from 'src/room/room.service';

/**
 * Service class for calculating total price of room bookings
 */
@Injectable()
export class CalculateTotalPriceValidation {
  /**
   * Creates an instance of CalculateTotalPriceValidation
   * @param roomService - Service to handle room-related operations
   */
  constructor(
    private readonly roomService: RoomService,
  ) {}

  /**
   * Calculates the total price for a room booking based on check-in and check-out dates
   * @param roomId - Unique identifier of the room
   * @param checkInDate - Date when the guest will check in
   * @param checkOutDate - Date when the guest will check out
   * @returns Total price for the booking period
   * @throws NotFoundException if the room is not found
   * @throws BadRequestException if check-out date is before or equal to check-in date
   */
  async calculateTotalPrice(
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<number> {
    const room = await this.roomService.findOne(roomId);
    if (!room) throw new NotFoundException('Room not found');

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    if (end <= start)
      throw new BadRequestException('Check-out must be after check-in date');

    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / millisecondsPerDay,
    );
    
    return room.price * days;
  }
}
