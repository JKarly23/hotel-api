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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/${process.env.NODE_ENV === 'production' ? '.env.production' : '.env'}`,
      load: [
        () => {
          console.log('Database Connection Config:', {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USER,
            database: process.env.DB_NAME,
            node_ENV: process.env.NODE_ENV,
          });
          return {};
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASS'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: process.env.NODE_ENV === 'production'? true : false,
        extra: {
          ssl: process.env.NODE_ENV === 'production'? {
            rejectUnauthorized: false,
          } : null,
        },
          
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
