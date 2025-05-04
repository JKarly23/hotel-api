import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/types/roles.enum';
import { PaginationDto } from './dto/pagination.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new room (Admin only)' })
  @ApiResponse({ status: 201, description: 'Room successfully created' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins allowed.' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of rooms' })
  findAll(@Query() { limit, page }: PaginationDto) {
    return this.roomService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Room found' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a room (Admin only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Room updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins allowed.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a room (Admin only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins allowed.' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roomService.remove(id);
  }

  
}
