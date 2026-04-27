import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { TipoLancamento, FormaPagamento, TipoConta } from "../../../node_modules/.prisma/client/enums";


export class CreateTransactionDto {
    @ApiProperty({
        description: 'Tipo de lançamento a ser feito',
        example: 'DESPESA',
    })
    @IsEnum(TipoLancamento, {message: 'O tipo deve ser \"RECEITA\" ou \"DESPESA\".'})
    @IsNotEmpty({ message: 'Defina qual é o tipo da transação.' })
    type!: TipoLancamento;

    @ApiProperty({
        description: 'Valor da compra',
        example: '5',
    })
    @IsNumber()
    @IsNotEmpty({message: 'Insira o valor da compra'})
    amount!: number;

    @ApiProperty({
        description: 'Data da transação',
        example: "26/04/2026",
    })
    @IsDate()
    @IsNotEmpty({message: 'Insira a data da transação'})
    date!: Date;

    @ApiProperty({
        description: 'Categoria da compra',
        example: 'Emergência',
    })
    @IsString()
    @IsNotEmpty({message: 'ID da categoria.'})
    categoryId!: string;

    @ApiProperty({
        description: 'Descrição da compra',
        example: 'Papel higiênico',
    })
    @IsString()
    @IsNotEmpty({message: 'Descreva o motivo da compra.'})
    description!: string;

    @ApiProperty({
        description: 'Método de pagamento',
        example: 'PIX',
    })
    @IsEnum(FormaPagamento, {message: 'A forma de pagamento deve ser: \'PARCELAS\', \'CARTAO_CREDITO\', \'CARTAO_DEBITO\', \'PIX\', \'TRANSFERENCIA\'.'})
    @IsNotEmpty({message: 'Insira o método de pagamento'})
    paymentMethod!: FormaPagamento;

    @ApiProperty({
        description: 'Tipo de conta usada',
        example: 'CORRENTE',
    })
    @IsEnum(TipoConta, {message: "O tipo de conta pode ser \'CORRENTE\' ou \'POUPANCA\'."})
    @IsNotEmpty({message: 'Escolha o tipo de conta'})
    accountType!: TipoConta;

    @ApiProperty({
        description: 'Quantidade de parcelas da compra',
        example: '8',
    })
    @IsNumber()
    @IsNotEmpty({message: 'Insira a quantidade de parcelas da compra.'})
    installments?: number;
}