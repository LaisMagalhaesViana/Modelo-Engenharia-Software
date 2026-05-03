import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { AccountType, launchType, PaymentMethod  } from "../../generated/prisma/enums";


export class CreateTransactionDto {
    @ApiProperty({
        description: 'Tipo de lançamento a ser feito',
        example: 'EXPENSES',
    })
    @IsEnum(launchType, { message: 'O tipo deve ser "INCOME" ou "EXPENSES".' })
    @IsNotEmpty({ message: 'Defina qual é o tipo do lançamento.' })
    type!: launchType;

    @ApiProperty({
        description: 'Valor do lançamento',
        example: 5.50,
    })
    @IsNumber()
    @IsNotEmpty({ message: 'Insira o valor.' })
    value!: number;

    @ApiProperty({
        description: 'Data do lançamento',
        example: "2026-04-26T00:00:00.000Z",
    })
    @IsDate()
    @IsNotEmpty({ message: 'Insira a data do lançamento.' })
    date!: Date;

    @ApiProperty({
        description: 'ID da categoria',
        example: 'uuid-da-categoria',
    })
    @IsString()
    @IsNotEmpty({ message: 'Informe o ID da categoria.' })
    categoryId!: string;

    @ApiProperty({
        description: 'Descrição do lançamento',
        example: 'Compra de supermercado',
    })
    @IsString()
    @IsNotEmpty({ message: 'Descreva o lançamento.' })
    description!: string;

    @ApiProperty({
        description: 'Método de pagamento',
        example: 'PIX',
    })
    @IsEnum(PaymentMethod, {
        message: "A forma de pagamento deve ser: 'INSTALLMENTS', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'TRANSFER'.",
    })
    @IsNotEmpty({ message: 'Insira o método de pagamento.' })
    paymentMethod!: PaymentMethod;

    @ApiProperty({
        description: 'Tipo de conta',
        example: 'CURRENT',
    })
    @IsEnum(AccountType, {
        message: "O tipo de conta deve ser 'CURRENT' ou 'SAVINGS'.",
    })
    @IsNotEmpty({ message: 'Escolha o tipo de conta.' })
    account!: AccountType;

    @ApiProperty({
        description: 'Quantidade de parcelas',
        example: 8,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    installmentsQuantity?: number;
    
    @ApiProperty({
        description: 'ID do usuário dono da transação',
        example: 'uuid-do-usuario',
    })
    @IsUUID()
    @IsNotEmpty({ message: 'O lançamento deve pertencer a um usuário.' })
    userId!: string;
}