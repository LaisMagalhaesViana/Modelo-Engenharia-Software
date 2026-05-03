import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserGuard } from '../user/user.guard';

import type { AuthenticatedRequest } from '../types';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  
  @UseGuards(UserGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @UseGuards(UserGuard)
  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.categoryService.findAll(req.user);
  }

  @UseGuards(UserGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.categoryService.findOne(id, req.user);
  }

  @UseGuards(UserGuard)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateCategoryDto: UpdateCategoryDto, @Request() req: AuthenticatedRequest) {
    return this.categoryService.update(id, updateCategoryDto, req.user);
  }

  @UseGuards(UserGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.categoryService.remove(id, req.user);
  }
}
