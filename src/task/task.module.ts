import { Module } from '@nestjs/common';
import { BookingTask } from './task.service';
import { BookingModule } from 'src/booking/booking.module';

@Module({
    providers: [
        BookingTask,
    ],
    imports: [
        BookingModule
    ],
})
export class TaskModule {}
