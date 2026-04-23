import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/createUserDto';
import { UpdateUserDto } from './dto/updateUserDto';

@Injectable()
export class UserService {
	async create(createUserDto: CreateUserDto) {
		// Realizar logica de criação de usuário com prisma
		return 'Retornar o usuário criado';
	}

	async findOne(id: string) {
		// Realizar logica de busca de usuário com prisma
		return 'Retornar o usuário buscado';
	}

	async findAll() {
		// Realizar logica de busca de todos os usuários com prisma
		return 'Retornar todos os usuários';
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		// Realizar logica de atualização de usuário com prisma
		return 'Retorna o usuário atualizado';
	}

	async remove(id: string) {
		// Realizar logica de remoção de usuário com prisma
		return;
	}
}
