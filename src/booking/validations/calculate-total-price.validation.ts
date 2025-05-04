import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoomService } from 'src/room/room.service';

@Injectable()
export class CalculateTotalPriceValidation {
  constructor(
    private readonly roomService: RoomService,
  ) {}
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
