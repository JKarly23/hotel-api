import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [RoomController],
  providers: [RoomService],
  imports: [
    TypeOrmModule.forFeature([Room]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  exports: [TypeOrmModule, RoomService],
})
export class RoomModule {}
