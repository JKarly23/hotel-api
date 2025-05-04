import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import {
  BookingValidate,
  CalculateTotalPriceValidation,
  HasEnoughCapacityValidation,
  RoomAvailableForRangeDates,
} from './validations';
import { AuthModule } from 'src/auth/auth.module';
import { RoomModule } from 'src/room/room.module';
@Module({
  controllers: [BookingController],
  providers: [
    BookingService,
    BookingValidate,
    HasEnoughCapacityValidation,
    RoomAvailableForRangeDates,
    CalculateTotalPriceValidation,
  ],
  imports: [TypeOrmModule.forFeature([Booking]), AuthModule, RoomModule],
  exports: [BookingService, TypeOrmModule],
})
export class BookingModule {}
