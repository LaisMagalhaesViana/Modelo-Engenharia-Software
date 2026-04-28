import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dto/LoginUserDto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private prismaService: PrismaService,
		private jwtService: JwtService,
	) {}

	async register(createUserDto: CreateUserDto) {
		const user = await this.userService.create(createUserDto);
		return user;
	}

	async login(loginUserDto: LoginUserDto) {
		// Verifica se o usuário existe
		const user = await this.prismaService.user.findUnique({ where: { email: loginUserDto.email } });
		if (!user) throw new BadRequestException('Verifique as credenciais e tente novamente.');

		// Verifica se a senha é valida
		const isValidPassword = await compare(loginUserDto.password, user.hashedPassword);
		if (!isValidPassword) throw new BadRequestException('Verifique as credenciais e tente novamente.');

		// Gera o token JWT
		const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role });

		return { token };
	}
}
