import { IsEnum, IsHexadecimal, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { CategoryType } from "../../generated/prisma/enums";
import { ApiProperty } from "@nestjs/swagger";


export class CreateCategoryDto {
    @ApiProperty({
        description: 'Nome da categoria',
        example: 'Lazer',
    })
    @IsString()
    @IsNotEmpty({ message: 'A categoria deve ter um nome.' })
    name!: string;

    @ApiProperty({
        description: 'Cor para representar a categoria',
        example: 'Azul',
    })
    @IsString()
    @IsHexadecimal()
    @IsNotEmpty({ message: 'Escolha uma cor para a categoria.' })
    color!: string;

    @ApiProperty({
        description: 'Tipo de categoria',
        example: 'RECEITA',
        enum: CategoryType,
    })
    @IsEnum(CategoryType, {
        message: 'O tipo deve ser "RECEITA" ou "DESPESA".',
    })
    @IsNotEmpty({ message: 'Defina um tipo de categoria.' })
    categoryType!: CategoryType;

    @ApiProperty({
        description: 'ID do usuário dono da categoria',
        example: 'uuid-do-usuario',
    })
    @IsUUID()
    @IsNotEmpty({ message: 'A categoria deve pertencer a um usuário.' })
    userId!: string;
}
