import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../types/roles.enum';
import { Booking } from 'src/booking/entities/booking.entity';

@Entity('Users')
export class Auth {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    description: 'Identificador único del usuario (UUID)',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @Column({ length: 500 })
  name: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Correo electrónico del usuario (único)',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'hashed_password',
    description: 'Contraseña del usuario (en formato hash)',
  })
  @Column()
  password: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'URL de la imagen de perfil del usuario',
  })
  @Column({ nullable: true })
  img: string;

  @ApiPropertyOptional({
    example: 'México',
    description: 'País de residencia del usuario',
  })
  @Column({ nullable: true })
  country: string;

  @ApiPropertyOptional({
    example: '1990-05-15',
    description: 'Fecha de nacimiento del usuario',
    type: String,
    format: 'date',
  })
  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @ApiPropertyOptional({
    example: '+52 123 456 7890',
    description: 'Número telefónico del usuario',
  })
  @Column({ nullable: true })
  phoneNumber: string;

  @ApiProperty({
    example: Role.USER,
    enum: Role,
    description: 'Rol asignado al usuario (admin, user, recepcionista)',
  })
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @ApiPropertyOptional({
    type: () => [Booking],
    description: 'Bookings associated with the user',
  })
  @OneToMany(() => Booking, (booking) => booking.user)
  @JoinColumn()
  bookings: Booking[];
}
