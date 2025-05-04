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
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PassportModule } from '@nestjs/passport';
@Module({
  controllers: [BookingController],
  providers: [
    BookingService,
    BookingValidate,
    HasEnoughCapacityValidation,
    RoomAvailableForRangeDates,
    CalculateTotalPriceValidation,
    RolesGuard,
  ],
  imports: [
    TypeOrmModule.forFeature([Booking]),
    AuthModule,
    RoomModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [BookingService, TypeOrmModule],
})
export class BookingModule {}
