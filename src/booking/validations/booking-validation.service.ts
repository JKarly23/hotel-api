import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from '../dto/create-booking.dto';
import {
  CalculateTotalPriceValidation,
  HasEnoughCapacityValidation,
  RoomAvailableForRangeDates,
} from '.';

/**
 * Service responsible for validating booking requests
 * @class BookingValidate
 */
@Injectable()
export class BookingValidate {
  constructor(
    private readonly calculatePrice: CalculateTotalPriceValidation,
    private readonly roomAvailable: RoomAvailableForRangeDates,
    private readonly hasEnoughCapacity: HasEnoughCapacityValidation,
  ) {}

  /**
   * Validates a booking request and calculates the total price
   * @param payload - The booking request data transfer object
   * @returns Promise<number> - The total price of the booking if validation passes
   * @throws BadRequestException if the room is not available or doesn't have enough capacity
   */
  async validateBooking(payload: CreateBookingDto): Promise<number> {
    const { checkInDate, checkOutDate, guests, roomId } = payload;

    // Perform all validations concurrently
    const [availabilityResult, capacityResult, totalPrice] = await Promise.all([
      this.roomAvailable.roomAvailableForRangeDates(
        roomId,
        checkInDate,
        checkOutDate,
      ),
      this.hasEnoughCapacity.hasEnoughCapacity(roomId, guests),
      this.calculatePrice.calculateTotalPrice(
        roomId,
        checkInDate,
        checkOutDate,
      ),
    ]);

    // Validate room availability
    if (!availabilityResult.isValid)
      throw new BadRequestException(availabilityResult.message);

    // Validate room capacity
    if (!capacityResult.isValid)
      throw new BadRequestException(capacityResult.message);

    return totalPrice;
  }
}
