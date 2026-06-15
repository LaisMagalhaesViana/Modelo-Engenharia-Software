import { ApiProperty } from '@nestjs/swagger';
import {
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
	MinLength,
} from 'class-validator';
import { launchType } from '../../generated/prisma/enums';

export class CreateTransactionDto {
	@ApiProperty({
		description: 'Tipo de lançamento a ser feito',
		example: '"INCOME" | "EXPENSES"',
		enum: launchType,
		required: true,
	})
	@IsEnum(launchType, { message: 'O tipo deve ser "INCOME" ou "EXPENSES".' })
	@IsNotEmpty({ message: 'Defina qual é o tipo do lançamento.' })
	type!: launchType;

	@ApiProperty({
		description: 'Valor do lançamento',
		example: 5.5,
		required: true,
	})
	@IsNumber()
	@IsNotEmpty({ message: 'Insira o valor.' })
	value!: number;

	@ApiProperty({
		description: 'Data do lançamento',
		example: '2026-04-26T00:00:00.000Z',
		required: true,
	})
	@IsDateString({}, { message: 'Insira uma data válida no formato ISO: AAAA-MM-DD.' })
	@IsNotEmpty({ message: 'A data do lançamento é obrigatória.' })
	date!: string;

	@ApiProperty({
		description: 'ID da categoria',
		example: 'uuid-da-categoria',
		required: true,
	})
	@IsUUID()
	@IsNotEmpty({ message: 'Informe o ID da categoria.' })
	categoryId!: string;

	@ApiProperty({
		description: 'Descrição do lançamento',
		example: 'Compra de supermercado',
		required: true,
	})
	@IsString()
	@IsNotEmpty({ message: 'Descreva o lançamento.' })
	@MinLength(1, { message: 'Descrição obrigatória' })
	@MaxLength(100, {
		message: 'A descrição deve ter no máximo 100 caracteres',
	})
	description!: string;

	@ApiProperty({
		description: 'ID do usuário dono da transação',
		example: 'uuid-do-usuario',
		required: true,
	})
	@IsUUID() //versão, {message: 'Insira um UUID válido.'}
	@IsNotEmpty({ message: 'O lançamento deve pertencer a um usuário.' })
	userId!: string;
}
