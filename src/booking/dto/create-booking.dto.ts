import {
  IsString,
  IsDate,
  IsNumber,
  IsEnum,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsCheckInAfterToday,
  IsCheckOutAfterCheckIn,
} from '../validations/custom-date.validators';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingStatus, PaymentStatus, PaymentMethod } from '../types/booking.enum';
export class CreateBookingDto {
  @ApiProperty({
    description: 'Fecha de check-in (debe ser posterior a hoy)',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  @IsCheckInAfterToday({ message: 'Check-in date must be after today' })
  checkInDate: Date;

  @ApiProperty({
    description: 'Fecha de check-out (debe ser posterior al check-in)',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  @IsCheckOutAfterCheckIn('checkInDate', {
    message: 'Check-out date must be after check-in date',
  })
  checkOutDate: Date;

  @ApiProperty({ description: 'Cantidad de huéspedes' })
  @IsNumber()
  guests: number;

  @ApiProperty({ description: 'Precio total de la reserva' })
  @IsNumber()
  totalPrice: number;

  @ApiPropertyOptional({
    enum: BookingStatus,
    description: 'Estado de la reserva',
  })
  @IsEnum(BookingStatus)
  @IsOptional()
  status?: BookingStatus;

  @ApiPropertyOptional({ enum: PaymentStatus, description: 'Estado del pago' })
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({ enum: PaymentMethod, description: 'Método de pago' })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiPropertyOptional({ description: 'Motivo de cancelación (si aplica)' })
  @IsString()
  @IsOptional()
  cancellationReason?: string;

  @ApiProperty({ description: 'ID del usuario', format: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID de la habitación', format: 'uuid' })
  @IsUUID()
  roomId: string;
}
