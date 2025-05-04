import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Booking } from "../entities/booking.entity";

@Injectable()
export class RoomAvailableForRangeDates {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
) {}
  async roomAvailableForRangeDates(
    id: string,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<{ isValid: boolean; message: string }> {
    const overlapping = await this.bookingRepository
      .createQueryBuilder('b')
      .where('b.room = :id', { id })
      .andWhere('b.checkInDate < :checkOutDate', { checkOutDate })
      .andWhere('b.checkOutDate > :checkInDate', { checkInDate })
      .getCount();
    return {
      isValid: overlapping === 0,
      message:
        overlapping > 0 ? 'Room is not available for the selected dates' : '',
    };
  }
}
