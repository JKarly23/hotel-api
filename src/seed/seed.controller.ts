import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Role } from 'src/auth/types/roles.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Seed')
@ApiBearerAuth()
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('rooms')
  @ApiOperation({
    summary: 'Populate rooms (only admin user)',
  })
  @ApiResponse({
    status: 201,
    description: 'Rooms successfully inserted',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Auth(Role.ADMIN)
  runSeedRooms() {
    return this.seedService.runSeedRooms();
  }
}
