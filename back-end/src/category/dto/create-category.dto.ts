import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TipoCategoria } from '@prisma/client';


export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({message: 'A categoria deve ter um nome.'})
    name!: string;

    @IsEnum(TipoCategoria, {message: 'O tipo deve ser \"RECEITA\" ou \"DESPESA\".'})
    @IsNotEmpty({message: 'Defina uma categoria.'})
    type!: TipoCategoria;
    
    @IsString()
    @IsNotEmpty({message: 'Escolha uma cor para a categoria.'})
    color!: string;
}
