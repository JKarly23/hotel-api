import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Role } from 'src/auth/types/roles.enum';
import { PaginationDto } from './dto/pagination.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @Auth(Role.ADMIN)
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

  @Get('all')
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiResponse({ status: 200, description: 'List of rooms' })
  findAllData() {
    return this.roomService.findAllData();
  }

  @Get('available')
  @ApiOperation({ summary: 'Get room by status available' })
  @ApiResponse({ status: 200, description: 'Room found' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  findRoomsAvailable() {
    return this.roomService.findRoomsAvailable();
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
  @Auth(Role.ADMIN)
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
  @Auth(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a room (Admin only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only admins allowed.' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.roomService.remove(id);
  }
}
