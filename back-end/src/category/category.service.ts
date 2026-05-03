import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtUserPayload } from '../types';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findFirst({
      where: { userId: createCategoryDto.userId, name: createCategoryDto.name }
    })
    if (existingCategory) throw new ConflictException('Categoria já existente. Caso queira criar uma nova, utilize outro nome.')

    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        color: createCategoryDto.color,
        categoryType: createCategoryDto.categoryType,
        userId: createCategoryDto.userId,
      },
    });
  }

  async findAll(authenticatedUser: JwtUserPayload) {
    // ADMINs conseguem ver as categorias de TODOS os usuários
    // USERs conseguem ver somente suas categorias

    if (authenticatedUser.role == 'ADMIN') {
      return this.prisma.category.findMany()
    }
    
    // limita as categorias ao usuário
    return this.prisma.category.findMany({
      where: { userId: authenticatedUser.id }
    })
  }

  async findOne(id: string, authenticatedUser: JwtUserPayload) {
    // ADMINs podem ver qualquer categoria
    // USERs podem ver somente as suas

    
    // limita as categorias ao usuário
    var existingCategory = await this.prisma.category.findUnique({
      where: { id, userId: authenticatedUser.id },
    });

    if (authenticatedUser.role == 'ADMIN') {
      var existingCategory = await this.prisma.category.findUnique({
        where: { id }
      })
    }

    if (!existingCategory)
      throw new NotFoundException("Categoria não encontrada.")

    else if (existingCategory.userId !== authenticatedUser.id && authenticatedUser.role !== 'ADMIN')
      throw new ForbiddenException("Acesso negado. Permissão insuficiente.")


    return existingCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, authenticatedUser: JwtUserPayload) {
    // ADMINs dão update em qualquer categoria
    // USERs dão update só em suas categorias

    
    // limita as categorias ao usuário
    var existingCategory = await this.prisma.category.findUnique({
      where: { id, userId: authenticatedUser.id },
    });

    if (authenticatedUser.role == 'ADMIN') {
      var existingCategory = await this.prisma.category.findUnique({
        where: { id }
      })
    }

    if (!existingCategory)
      throw new NotFoundException("Categoria não encontrada.")

    else if (authenticatedUser.id !== existingCategory.userId && authenticatedUser.role !== 'ADMIN')
      throw new ForbiddenException("Acesso negado. Permissão insuficiente.")

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string, authenticatedUser: JwtUserPayload) {
    // ADMINs apagam tudo
    // USERs apagam só o seu

    // limita as categorias ao usuário
    var existingCategory = await this.prisma.category.findUnique({
      where: { id, userId: authenticatedUser.id },
    });

    if (authenticatedUser.role == 'ADMIN') {
      var existingCategory = await this.prisma.category.findUnique({
        where: { id }
      })
    }

    if (!existingCategory)
      throw new NotFoundException("Categoria não encontrada.")

    else if (authenticatedUser.id !== existingCategory.userId && authenticatedUser.role !== 'ADMIN')
      throw new ForbiddenException("Acesso negado. Permissão insuficiente.")

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
