import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// "copia" a DTO de criação e transforma tudo em opcional.
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
