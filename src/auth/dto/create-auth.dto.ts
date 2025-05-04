import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../types/roles.enum';
  
  export class CreateAuthDto {
    @ApiProperty({ description: 'Nombre del usuario', minLength: 3 })
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
    })
    @IsOptional()
    img?: string;
  
    @ApiPropertyOptional({
      enum: Role,
      description: 'Rol del usuario (admin, user, recepcionista)',
    })
    @IsOptional()
    @IsEnum(Role, { message: 'Invalid role' })
    role?: Role;
  }
  