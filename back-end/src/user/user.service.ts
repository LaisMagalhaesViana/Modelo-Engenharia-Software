import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/createUserDto';
import { UpdateUserDto } from './dto/updateUserDto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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
		const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

		const user = await this.prismaService.user.create({
			data: {
				name: createUserDto.name,
				email: createUserDto.email,
				hashedPassword: hashedPassword,
				phoneNumber: createUserDto.phoneNumber,
				monthlyIncome: createUserDto.monthlyIncome,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		});
		return user;
	}

	async findOne(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
		});

		if (!user) throw new BadRequestException('Usuário não encontrado.');

		const { hashedPassword, ...userWithoutPassword } = user;
		return userWithoutPassword;
	}

	async findAll() {
		const users = await this.prismaService.user.findMany({});
		return users.map(({ hashedPassword, ...user }) => user);
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		// Realizar logica de atualização de usuário com prisma
		const user = await this.prismaService.user.findUnique({
			where: { id },
		});

		if (!user) throw new BadRequestException('Usuário não encontrado.');

		user.name = updateUserDto.name ?? user.name;
		user.email = updateUserDto.email ?? user.email;
		user.phoneNumber = updateUserDto.phoneNumber ?? user.phoneNumber;
		user.monthlyIncome = updateUserDto.monthlyIncome ?? user.monthlyIncome;
		user.updatedAt = new Date();

		await this.prismaService.user.update({
			where: { id },
			data: user,
		});
		return user;
	}

	async remove(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: { id },
		});

		if (!user) throw new BadRequestException('Usuário não encontrado.');

		await this.prismaService.user.delete({
			where: { id },
		});
		return;
	}
}
