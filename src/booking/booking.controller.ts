import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/types/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginationDto } from 'src/room/dto/pagination.dto';

@UseGuards(AuthGuard(), RolesGuard)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ type: CreateBookingDto })
  @ApiResponse({ status: 201, description: 'Booking created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid booking data.' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.RECEPCIONIST)
  @ApiOperation({ summary: 'Get all bookings (paginated)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiResponse({ status: 200, description: 'List of bookings.' })
  findAll(@Query('query') { page, limit }: PaginationDto) {
    return this.bookingService.findAll(page, limit);
  }

  @Get('all')
  @Roles(Role.ADMIN, Role.RECEPCIONIST)
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiResponse({ status: 200, description: 'List of bookings.' })
  findAllData() {
    return this.bookingService.findAllData();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all bookings for a specific user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'List of bookings for the user.' })
  @ApiResponse({ status: 404, description: 'Bookings not found for the user.' })
  findAllByUser(@Param('userId') userId: string) {
    return this.bookingService.findAllByUser(userId);
  }

  @Get('room/:roomId')
  @ApiOperation({ summary: 'Get all bookings for a specific room' })
  @ApiParam({ name: 'roomId', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'List of bookings for the room.' })
  @ApiResponse({ status: 404, description: 'Bookings not found for the room.' })
  findAllByRoom(@Param('roomId') roomID: string) {
    return this.bookingService.findAllByRoom(roomID);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking found.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Post('check-in')
  @Roles(Role.RECEPCIONIST)
  @ApiOperation({ summary: 'Check in a booking (receptionist only)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Check-in successful.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  checkIn(@Body() payload: { id: string; userId: string; roomId: string }) {
    return this.bookingService.checkIn(payload);
  }

  @Post('check-out')
  @Roles(Role.RECEPCIONIST)
  @ApiOperation({ summary: 'Check out a booking (receptionist only)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Check-out successful.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  checkOut(@Body() payload: { id: string; userId: string; roomId: string }) {
    return this.bookingService.checkOut(payload);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Update a booking (admin only)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiBody({ type: UpdateBookingDto })
  @ApiResponse({ status: 200, description: 'Booking updated successfully.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a booking (admin only)' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Booking deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  remove(@Param('id') id: string) {
    return this.bookingService.remove(id);
  }
}
