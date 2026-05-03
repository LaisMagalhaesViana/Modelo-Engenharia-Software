import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UserGuard } from '../user/user.guard';

import  type { AuthenticatedRequest } from '../types';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @UseGuards(UserGuard)
  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @UseGuards(UserGuard)
  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.transactionService.findAll(req.user);
  }

  @UseGuards(UserGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.transactionService.findOne(id, req.user);
  }

  @UseGuards(UserGuard)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req: AuthenticatedRequest) {
    return this.transactionService.update(id, updateTransactionDto, req.user);
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.transactionService.remove(id, req.user);
  }
}
