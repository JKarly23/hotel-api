import { Controller, Post, Body, Req, Get, Param, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUserDto } from './dto/login-auth.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Auth } from './decorators/auth.decorator';
import { Role } from './types/roles.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: CreateAuthDto })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  register(@Body() user: CreateAuthDto) {
    return this.authService.register(user);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión de usuario' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Get('profile')
  @Auth(Role.ADMIN, Role.USER, Role.RECEPCIONIST)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  profile(@Req() req: Request) {
    return req.user;
  }

  @Get()
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users paginated' })
  @ApiResponse({
    status: 200,
    description: 'List of all users retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  findAll() {
    return this.authService.findAll();
  }

  @Get('all')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Requires admin role.' })
  findAllData() {
    return this.authService.findAllData();
  }

  @Patch('/:id')
  @Auth()
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateAuthDto })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Post('logout/:id')
  @Auth()
  @ApiOperation({ summary: 'Cerrar sesión de usuario' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Cierre de sesión exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  logout(@Param('id') id: string) {
    return this.authService.logout(id);
  }

  @Get('refresh')
  @Auth()
  refreshToken(@Req() req: Request) {
    const user = req.user;
    return user ? this.authService.refreshToken(user) : null;
  }
}
