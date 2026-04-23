import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';

@Injectable()
export class AuthService {
	async createUser(createUserDto: CreateUserDto) {
		// Aplicar logica de criação de usuário com prisma
		return 'Usuário criado com sucesso';
	}
}
