import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Room } from 'src/room/entities/room.entity';
import {
  BookingStatus,
  PaymentStatus,
  PaymentMethod,
} from '../types/booking.enum';

@Entity('Reservations')
export class Booking {
  @ApiProperty({
    example: '1a2b3c4d-5678-90ab-cdef-1234567890ab',
    description: 'ID único de la reserva',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '2025-06-01T15:00:00.000Z',
    description: 'Fecha y hora programadas para el check-in',
  })
  @Column({ type: 'timestamp' })
  checkInDate: Date;

  @ApiProperty({
    example: '2025-06-07T11:00:00.000Z',
    description: 'Fecha y hora programadas para el check-out',
  })
  @Column({ type: 'timestamp' })
  checkOutDate: Date;

  @ApiPropertyOptional({
    example: '2025-06-01T15:30:00.000Z',
    description: 'Fecha y hora reales del check-in',
  })
  @Column({ type: 'timestamp', nullable: true })
  actualCheckIn: Date;

  @ApiPropertyOptional({
    example: '2025-06-07T10:45:00.000Z',
    description: 'Fecha y hora reales del check-out',
  })
  @Column({ type: 'timestamp', nullable: true })
  actualCheckOut: Date;

  @ApiProperty({
    example: 2,
    description: 'Número de huéspedes',
  })
  @Column('int')
  guests: number;

  @ApiProperty({
    example: 750.0,
    description: 'Precio total de la reserva',
  })
  @Column('float')
  totalPrice: number;

  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    description: 'Estado actual de la reserva',
  })
  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;

  @ApiProperty({
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
    description: 'Estado del pago',
  })
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
    description: 'Método de pago seleccionado',
  })
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CREDIT_CARD,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    example: '2025-05-01T14:23:00.000Z',
    description: 'Fecha de creación del registro de la reserva',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2025-05-02T09:15:00.000Z',
    description: 'Fecha de la última actualización del registro de la reserva',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiPropertyOptional({
    example: 'El huésped no se presentó',
    description: 'Razón de cancelación (si aplica)',
  })
  @Column({ nullable: true })
  cancellationReason: string;

  @ApiProperty({
    type: () => Auth,
    description: 'Usuario que realizó la reserva',
  })
  @ManyToOne(() => Auth, (user) => user.bookings)
  @JoinColumn()
  user: Auth;

  @ApiProperty({
    type: () => Room,
    description: 'Habitación asociada a la reserva',
  })
  @ManyToOne(() => Room, (room) => room.bookings)
  @JoinColumn()
  room: Room;
}
