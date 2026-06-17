import { IsEnum, IsHexadecimal, IsHexColor, IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { CategoryType } from '../../generated/prisma/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
	@ApiProperty({
		description: 'Nome da categoria',
		example: 'Lazer',
		required: true,
	})
	@IsString()
	@IsNotEmpty({ message: 'A categoria deve ter um nome.' })
	@MinLength(1, { message: 'Nome obrigatório' })
	@MaxLength(100, {
		message: 'O nome deve ter no máximo 100 caracteres',
	})
	name!: string;

	@ApiProperty({
		description: 'Cor para representar a categoria',
		example: '#3B82F6',
		required: true,
	})
	@IsHexColor({
		message: 'Informe uma cor válida em hexadecimal (ex: #FFFFFF)',
	})
	@IsNotEmpty({ message: 'Escolha uma cor para a categoria.' })
	color!: string;

	@ApiProperty({
		description: 'Tipo de categoria',
		example: '"INCOME" | "EXPENSES"',
		enum: CategoryType,
		required: true,
	})
	@IsEnum(CategoryType, {
		message: 'O tipo deve ser "INCOME" ou "EXPENSES".',
	})
	@IsNotEmpty({ message: 'Defina um tipo de categoria.' })
	categoryType!: CategoryType;

	@ApiProperty({
		description: 'ID do usuário dono da categoria',
		example: 'uuid-do-usuario',
		required: true,
	})
	@IsUUID()
	@IsNotEmpty({ message: 'A categoria deve pertencer a um usuário.' })
	userId!: string;
}
