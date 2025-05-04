import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    IsPositive,
    IsUrl,
    IsInt,
  } from 'class-validator';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoomType, RoomStatus } from '../types/room.enum';
  
  export class CreateRoomDto {
    @ApiProperty({
      example: 101,
      description: 'Número de habitación. Debe ser único y mayor a 0.',
    })
    @IsNumber(
      {},
      { message: 'El número de habitación debe ser un valor numérico' },
    )
    @IsPositive({ message: 'El número de habitación debe ser positivo' })
    @Min(1, { message: 'El número de habitación no puede ser menor a 1' })
    number: number;
  
    @ApiProperty({
      enum: RoomType,
      description: 'Tipo de habitación (ej: single, double, suite)',
    })
    @IsEnum(RoomType, {
      message: `Tipo de habitación inválido. Opciones válidas: ${Object.values(RoomType).join(', ')}`,
    })
    type: RoomType;
  
    @ApiProperty({
      example: 2,
      description: 'Capacidad máxima de personas que puede alojar la habitación',
    })
    @IsInt({ message: 'La capacidad debe ser un número entero' })
    @Min(1, { message: 'La capacidad mínima es 1' })
    capacity: number;
  
    @ApiProperty({
      example: 150.5,
      description: 'Precio por noche en la habitación',
    })
    @IsNumber({}, { message: 'El precio debe ser un número' })
    @IsPositive({ message: 'El precio debe ser mayor a 0' })
    price: number;
  
    @ApiPropertyOptional({
      enum: RoomStatus,
      description:
        'Estado actual de la habitación (ej: available, occupied, maintenance)',
    })
    @IsEnum(RoomStatus, {
      message: `Estado inválido. Opciones válidas: ${Object.values(RoomStatus).join(', ')}`,
    })
    @IsOptional()
    status?: RoomStatus;
  
    @ApiPropertyOptional({
      example: 'Habitación espaciosa con vista al mar.',
      description: 'Descripción opcional de la habitación',
    })
    @IsString({ message: 'La descripción debe ser texto' })
    @IsOptional()
    description?: string;
  
    @ApiProperty({
      example: 3,
      description: 'Número del piso donde se encuentra la habitación',
    })
    @IsInt({ message: 'El piso debe ser un número entero' })
    @Min(0, { message: 'El piso no puede ser negativo' })
    floor: number;
  
    @ApiPropertyOptional({
      example: 'https://example.com/image.jpg',
      description: 'URL de una imagen representativa de la habitación',
    })
    @IsUrl({}, { message: 'La imagen debe ser una URL válida' })
    @IsOptional()
    img?: string;
  }
  