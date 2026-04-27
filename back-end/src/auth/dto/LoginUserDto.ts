import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
	@ApiProperty({
		description: 'E-mail para login e notificações',
		example: 'joao@exemplo.com.br',
	})
	@IsEmail({}, { message: 'O e-mail informado não é válido.' })
	@IsNotEmpty({ message: 'O e-mail é obrigatório.' })
	email!: string;

	@ApiProperty({
		description: 'Senha de acesso (mínimo 8 caracteres)',
		example: 'Senha@123',
		minLength: 8,
		format: 'password',
	})
	@IsString({ message: 'A senha deve ser uma string.' })
	@MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres.' })
	password!: string;
}
