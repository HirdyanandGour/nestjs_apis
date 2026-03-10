import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: slugify(dto.name, { lower: true, strict: true }),
      },
    });
  }

  findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    await this.ensureExists(id);
    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name
          ? {
              name: dto.name,
              slug: slugify(dto.name, { lower: true, strict: true }),
            }
          : {}),
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.category.delete({ where: { id } });
  }

  private async ensureExists(id: number): Promise<void> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }
}
