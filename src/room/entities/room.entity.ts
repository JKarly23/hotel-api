import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoomType, RoomStatus } from '../types/room.enum';
import { Booking } from 'src/booking/entities/booking.entity';

@Entity('Rooms')
export class Room {
  @ApiProperty({
    description: 'Unique identifier for the room',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Room number', uniqueItems: true })
  @Column({ unique: true })
  number: number;

  @ApiProperty({ enum: RoomType, description: 'Type of the room' })
  @Column({ type: 'enum', enum: RoomType, default: RoomType.SIMPLEX })
  type: RoomType;

  @ApiProperty({ description: 'Capacity of the room' })
  @Column({ type: 'int' })
  capacity: number;

  @ApiProperty({ description: 'Price per night' })
  @Column({ type: 'float' })
  price: number;

  @ApiProperty({ enum: RoomStatus, description: 'Current status of the room' })
  @Column({ type: 'enum', enum: RoomStatus, default: RoomStatus.AVAILABLE })
  status: RoomStatus;

  @ApiPropertyOptional({
    description: 'Description of the room',
    maxLength: 700,
  })
  @Column({ length: 700, nullable: true })
  description: string;

  @ApiProperty({ description: 'Floor where the room is located' })
  @Column()
  floor: number;

  @ApiProperty({ description: 'Date when the room was created' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Date when the room was last updated' })
  @UpdateDateColumn()
  updated_at: Date;

  @ApiProperty({ description: 'Image URL of the room' })
  @Column()
  img: string;

  @ApiPropertyOptional({
    type: () => [Booking],
    description: 'Bookings associated with the room',
  })
  @OneToMany(() => Booking, (booking) => booking.room, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  bookings: Booking[];
}
