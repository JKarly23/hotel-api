import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { RoomModule } from './room/room.module';
import { BookingModule } from './booking/booking.module';
import { TaskModule } from './task/task.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('HOST'),
        port: Number(configService.get<number>('DBPORT')),
        username: 'postgres',
        password: 'postgres',
        database: configService.get<string>('DBNAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    RoomModule,
    BookingModule,
    TaskModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
