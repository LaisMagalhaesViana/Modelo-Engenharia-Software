import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'; // BadRequestException
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtUserPayload } from '../types';


@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createTransactionDto: CreateTransactionDto) {
    return this.prisma.launch.create({
      data: {
        type: createTransactionDto.type,
        value: createTransactionDto.value,

        date: new Date(createTransactionDto.date),

        description: createTransactionDto.description,
        paymentMethod: createTransactionDto.paymentMethod,
        account: createTransactionDto.account,
        installmentsQuantity: createTransactionDto.installmentsQuantity ?? 1,
        category: {
          connect: {
            id: createTransactionDto.categoryId
          },
        },
        user: {
          connect: {
            id: createTransactionDto.userId,
          },
        },

      }
    })
  }

  async findAll(authenticatedUser: JwtUserPayload) {
    // ADMINs conseguem ver as transações de TODOS os usuários
    // USERs conseguem ver somente suas transações

    if (authenticatedUser.role == 'ADMIN') {
      return this.prisma.launch.findMany()
    }

    // limita as categorias ao usuário
    return this.prisma.launch.findMany({
      where: { userId: authenticatedUser.id }
    })
  }

  async findOne(id: string, authenticatedUser: JwtUserPayload) {
    var existingTransaction = await this.prisma.launch.findUnique({
      where: { id, userId: authenticatedUser.id },
    })

    if(authenticatedUser.role == 'ADMIN'){
      var existingTransaction = await this.prisma.launch.findUnique({
        where: { id },
      })
    }

    if (!existingTransaction) {
      throw new NotFoundException(`Transação número ${id} não encontrado.`)
    }

    else if (existingTransaction.userId !== authenticatedUser.id && authenticatedUser.role !== 'ADMIN')
      throw new ForbiddenException("Acesso negado. Permissão insuficiente.")

    return existingTransaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto, authenticatedUser: JwtUserPayload) {
// ADMINs dão update em qualquer categoria
    // USERs dão update só em suas categorias

    
    // limita as categorias ao usuário
    var existingTransaction = await this.prisma.launch.findUnique({
      where: { id, userId: authenticatedUser.id },
    });

    if (authenticatedUser.role == 'ADMIN') {
      var existingTransaction = await this.prisma.launch.findUnique({
        where: { id }
      })
    }

    if (!existingTransaction)
      throw new NotFoundException("Lançamento não encontrado.")

    else if (authenticatedUser.id !== existingTransaction.userId && authenticatedUser.role !== 'ADMIN')
      throw new ForbiddenException("Acesso negado. Permissão insuficiente.")

    return this.prisma.launch.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  async remove(id: string, authenticatedUser: JwtUserPayload) {
    // ADMINs apagam tudo
    // USERs apagam só o seu

    // limita as categorias ao usuário
    var existingTransaction = await this.prisma.launch.findUnique({
      where: { id, userId: authenticatedUser.id },
    });

    if (authenticatedUser.role == 'ADMIN') {
      var existingTransaction = await this.prisma.launch.findUnique({
        where: { id }
      })
    }

    if (!existingTransaction)
      throw new NotFoundException("Lançamento não encontrado.")

    else if (authenticatedUser.id !== existingTransaction.userId && authenticatedUser.role !== 'ADMIN')
      throw new ForbiddenException("Acesso negado. Permissão insuficiente.")

    return this.prisma.launch.delete({
      where: { id },
    });
  }
}
