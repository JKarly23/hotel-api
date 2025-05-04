import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from '../dto/create-booking.dto';
import {
  CalculateTotalPriceValidation,
  HasEnoughCapacityValidation,
  RoomAvailableForRangeDates,
} from '.';


@Injectable()
export class BookingValidate {
  constructor(
    private readonly calculatePrice: CalculateTotalPriceValidation,
    private readonly roomAvailable: RoomAvailableForRangeDates,
    private readonly hasEnoughCapacity: HasEnoughCapacityValidation,
  ) {}
  async validateBooking(payload: CreateBookingDto): Promise<number> {
    const { checkInDate, checkOutDate, guests, roomId } = payload;
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
    if (!availabilityResult.isValid)
      throw new BadRequestException(availabilityResult.message);
    if (!capacityResult.isValid)
      throw new BadRequestException(capacityResult.message);
    return totalPrice;
  }
}
