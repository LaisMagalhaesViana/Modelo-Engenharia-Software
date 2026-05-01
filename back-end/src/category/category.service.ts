import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findFirst({
      where: {name: createCategoryDto.name}
    })
    if(existingCategory) throw new ConflictException('Categoria já existente. Caso queira criar uma nova, utilize outro nome.')


    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        color: createCategoryDto.color,
        categoryType: createCategoryDto.categoryType,
        userId: createCategoryDto.userId,
      },
    });
  }

  async findAll() {
    // TODO: verificação de usuário / adm vê tudo, user somente o seu

    return this.prisma.category.findMany();
  }

  async findOne(id: string) {
     const existingCategory = this.prisma.category.findUnique({
      where: { id },
    });

    if(!existingCategory){
      throw new NotFoundException("Categoria não encontrada.")
    }
    
    return existingCategory;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    // TODO: verificação de usuário / adm altera tudo, user somente o seu

    
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string) {
    // TODO: verificação de usuário / adm apaga tudo, user somente o seu

    await this.findOne(id);
    
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
