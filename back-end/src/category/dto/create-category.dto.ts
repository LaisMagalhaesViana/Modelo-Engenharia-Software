import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TipoCategoria } from "../../../node_modules/.prisma/client/enums";
import { ApiProperty } from "@nestjs/swagger";


export class CreateCategoryDto {
    @ApiProperty({
            description: 'Nome da categoria',
            example: 'Lazer',
        })
    @IsString()
    @IsNotEmpty({message: 'A categoria deve ter um nome.'})
    name!: string;

    @ApiProperty({
		description: 'Tipo de categoria',
		example: 'RECEITA',
	})
    @IsEnum(TipoCategoria, {message: 'O tipo deve ser \"RECEITA\" ou \"DESPESA\".'})
    @IsNotEmpty({message: 'Defina uma categoria.'})
    type!: TipoCategoria;
    
    @ApiProperty({
		description: 'Cor para representar a categoria',
		example: 'Azul',
	})
    @IsString()
    @IsNotEmpty({message: 'Escolha uma cor para a categoria.'})
    color!: string;
}
