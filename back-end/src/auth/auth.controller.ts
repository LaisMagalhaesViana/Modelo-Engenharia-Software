import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/createUserDto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/LoginUserDto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	// POST /auth/signup
	@ApiOperation({ summary: 'Registrar um novo usuário' })
	@ApiResponse({ status: 201, description: 'Usuário criado com sucesso.', type: CreateUserDto })
	@Post('signup')
	async register(@Body(new ValidationPipe()) body: CreateUserDto) {
		const user = await this.authService.register(body);
		return user;
	}

	@ApiOperation({ summary: 'Logar com o usuário' })
	@ApiResponse({ status: 201, description: 'Login realizado com sucesso.', type: CreateUserDto })
	@Post('signin')
	async login(@Body(new ValidationPipe()) body: LoginUserDto) {
		const token = await this.authService.login(body);
		return token;
	}
}
