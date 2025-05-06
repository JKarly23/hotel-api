import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcryptjs';
import { Booking } from 'src/booking/entities/booking.entity';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  logger = new Logger('AuthService');
  constructor(
    @InjectRepository(Auth)
    private readonly userRepository: Repository<Auth>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async register(user: CreateAuthDto) {
    const { password, ...data } = user;
    try {
      const newUser = this.userRepository.create({
        ...user,
        password: await bcrypt.hash(password, +this.configService.get('SALT')),
      });
      await this.userRepository.save(newUser);
      return {
        id: newUser.id,
        ...data,
        token: await this.getJwtToken({ id: newUser.id, role: newUser.role }),
      };
    } catch (err) {
      this.handleException(err);
    }
  }
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('User not found');
    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException(`Credentials are not valid`);
    const { password: pass, ...data } = user;
    return {
      ...data,
      token: await this.getJwtToken({ id: user.id, role: user.role }),
    };
  }

  async findAll(page = 1, limit = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      relations: {
        bookings: true,
      },
    });
    return {
      users: users.map((user: Auth) => ({
        ...user,
        bookings: user.bookings.map((booking: Booking) => ({
          id: booking.id,
          checkIn: booking.checkInDate,
          checkOut: booking.checkOutDate,
          total: booking.totalPrice,
          room: booking.room.number,
        })),
      })),
      total,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async update(id: string, updateAuthDto: UpdateAuthDto) {
    try {
      const user = await this.userRepository.preload({
        id,
        ...updateAuthDto,
      });
      if (!user) throw new NotFoundException(`User with id ${id} not found`);
      return this.userRepository.save(user);
    } catch (error) {
      this.handleException(error);
    }
  }

  handleException(err: any) {
    if (err.code === '23505') {
      throw new BadRequestException(err.detail);
    }
    throw new InternalServerErrorException(err.message);
  }

  async getJwtToken(payload: { id: string; role: string }) {
    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
