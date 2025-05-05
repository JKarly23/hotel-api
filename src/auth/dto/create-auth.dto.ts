import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
    IsUUID,
    IsDateString,
    IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../types/roles.enum';

export class CreateAuthDto {
    @ApiPropertyOptional({
        example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        description: 'Identificador único del usuario (UUID)',
    })
    @IsOptional()
    @IsUUID()
    id?: string;

    @ApiProperty({ description: 'Nombre completo del usuario', minLength: 3 })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({
        description: 'Correo electrónico del usuario',
        example: 'usuario@email.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Contraseña del usuario', minLength: 3 })
    @IsString()
    @MinLength(3)
    password: string;

    @ApiPropertyOptional({
        description: 'URL de la imagen de perfil del usuario',
        example: 'https://example.com/avatar.jpg',
    })
    @IsOptional()
    img?: string;

    @ApiPropertyOptional({
        description: 'País de residencia del usuario',
        example: 'México',
    })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional({
        description: 'Fecha de nacimiento del usuario',
        example: '1990-05-15',
        type: String,
        format: 'date',
    })
    @IsOptional()
    @IsDateString()
    birthDate?: Date;

    @ApiPropertyOptional({
        description: 'Número telefónico del usuario',
        example: '+52 123 456 7890',
    })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiPropertyOptional({
        enum: Role,
        description: 'Rol del usuario (admin, user, recepcionista)',
        example: Role.USER,
    })
    @IsOptional()
    @IsEnum(Role, { message: 'Invalid role' })
    role?: Role;

    @ApiPropertyOptional({
        description: 'Bookings asociados al usuario',
        type: 'array',
        items: { type: 'object' },
    })
    @IsOptional()
    @IsArray()
    bookings?: any[];
}
  