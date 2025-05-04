import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Booking } from "../entities/booking.entity";

/**
 * Service class to validate room availability for specific date ranges
 */
@Injectable()
export class RoomAvailableForRangeDates {
  /**
   * Creates an instance of RoomAvailableForRangeDates
   * @param bookingRepository - Repository to handle Booking entity operations
   */
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  /**
   * Checks if a room is available for a specific date range
   * @param id - Room identifier
   * @param checkInDate - Desired check-in date
   * @param checkOutDate - Desired check-out date
   * @returns Object containing validation result and message
   *          - isValid: true if room is available, false otherwise
   *          - message: Error message if room is not available, empty string otherwise
   */
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
