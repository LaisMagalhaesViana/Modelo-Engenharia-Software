import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/createUserDto';
import { UpdateUserDto } from './dto/updateUserDto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtUserPayload } from '../types';

@Injectable()
export class UserService {
	constructor(private prismaService: PrismaService) {}

	async create(createUserDto: CreateUserDto) {
		const existingUser = await this.prismaService.user.findUnique({
			where: { email: createUserDto.email },
		});

		if (existingUser) {
			throw new BadRequestException('Esse usuário já existe. Por favor, utilize outro e-mail.');
		}

		const salt = await bcrypt.genSalt(10);
		const password = await bcrypt.hash(createUserDto.password, salt);

		const user = await this.prismaService.user.create({
			data: {
				name: createUserDto.name,
				email: createUserDto.email,
				hashedPassword: password,
				role: 'USER',
				phoneNumber: createUserDto.phoneNumber,
				monthlyIncome: createUserDto.monthlyIncome,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});

		const { hashedPassword, ...userWithoutPassword } = user;
		return userWithoutPassword;
	}

	async findOne(id: string, authenticatedUser: JwtUserPayload) {
		if (authenticatedUser.role !== 'ADMIN') {
			throw new UnauthorizedException('Acesso negado. Permissão insuficiente.');
		}

		const existingUser = await this.prismaService.user.findUnique({
			where: { id },
		});

		if (!existingUser) throw new NotFoundException('Usuário não encontrado.');

		const { hashedPassword, ...userWithoutPassword } = existingUser;
		return userWithoutPassword;
	}

	async findAll(authenticatedUser: JwtUserPayload) {
		if (authenticatedUser.role !== 'ADMIN') {
			throw new UnauthorizedException('Acesso negado. Permissão insuficiente.');
		}

		const users = await this.prismaService.user.findMany({ where: { role: 'USER' } });
		return users.map(({ hashedPassword, ...user }) => user);
	}

	async update(id: string, updateUserDto: UpdateUserDto, authenticatedUser: JwtUserPayload) {
		if (authenticatedUser.role !== 'ADMIN' && authenticatedUser.id !== id) {
			throw new UnauthorizedException('Acesso negado. Permissão insuficiente.');
		}

		const user = await this.prismaService.user.findUnique({
			where: { id },
		});

		if (!user) throw new NotFoundException('Usuário não encontrado.');

		const emailAlreadyInUse = updateUserDto.email
			? await this.prismaService.user.findFirst({
					where: {
						email: updateUserDto.email,
						id: { not: id },
					},
				})
			: null;

		if (emailAlreadyInUse) throw new BadRequestException('O e-mail informado já está em uso por outro usuário.');

		user.name = updateUserDto.name ?? user.name;
		user.email = updateUserDto.email ?? user.email;
		user.phoneNumber = updateUserDto.phoneNumber ?? user.phoneNumber;
		user.monthlyIncome = updateUserDto.monthlyIncome ?? user.monthlyIncome;
		user.updatedAt = new Date();

		await this.prismaService.user.update({
			where: { id },
			data: user,
		});
		const { hashedPassword, ...userWithoutPassword } = user;
		return userWithoutPassword;
	}

	async remove(id: string, authenticatedUser: JwtUserPayload) {
		if (authenticatedUser.role !== 'ADMIN' && authenticatedUser.id !== id) {
			throw new UnauthorizedException('Acesso negado. Permissão insuficiente.');
		}

		const user = await this.prismaService.user.findUnique({
			where: { id },
		});

		if (!user) throw new NotFoundException('Usuário não encontrado.');

		await this.prismaService.user.delete({
			where: { id },
		});
		return;
	}
}
