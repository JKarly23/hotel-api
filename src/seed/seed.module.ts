import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { RoomModule } from 'src/room/room.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[
    RoomModule,  PassportModule.register({ defaultStrategy: 'jwt' }),
  ]
})
export class SeedModule {}
