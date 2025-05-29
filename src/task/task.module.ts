import { Module } from '@nestjs/common';
import { BookingTask } from './task.service';
import { BookingModule } from 'src/booking/booking.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    providers: [
        BookingTask,
    ],
    imports: [
        ScheduleModule.forRoot(),
        BookingModule
    ],
})
export class TaskModule {}
