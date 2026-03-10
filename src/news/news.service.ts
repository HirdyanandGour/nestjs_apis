import { Injectable, NotFoundException } from '@nestjs/common';
import { News } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsQueryDto } from './dto/news-query.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateNewsDto, authorId: number): Promise<News> {
    return this.prisma.news.create({
      data: {
        ...dto,
        slug: this.buildSlug(dto.title),
        authorId,
      },
    });
  }

  async update(id: number, dto: UpdateNewsDto): Promise<News> {
    await this.ensureExists(id);
    return this.prisma.news.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.title ? { slug: this.buildSlug(dto.title) } : {}),
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.news.delete({ where: { id } });
  }

  async getLatest(query: NewsQueryDto) {
    return this.paginatedFind({
      where: this.searchWhere(query.search),
      query,
      orderBy: { createdAt: 'desc' },
    });
  }

  getBreaking(query: NewsQueryDto) {
    return this.paginatedFind({
      where: { ...this.searchWhere(query.search), isBreaking: true },
      query,
      orderBy: { createdAt: 'desc' },
    });
  }

  getTrending(query: NewsQueryDto) {
    return this.paginatedFind({
      where: { ...this.searchWhere(query.search), isTrending: true },
      query,
      orderBy: { createdAt: 'desc' },
    });
  }

  getByCategory(categoryId: number, query: NewsQueryDto) {
    return this.paginatedFind({
      where: { ...this.searchWhere(query.search), categoryId },
      query,
      orderBy: { createdAt: 'desc' },
    });
  }

  search(query: NewsQueryDto) {
    return this.paginatedFind({
      where: this.searchWhere(query.search),
      query,
      orderBy: { createdAt: 'desc' },
    });
  }

  private searchWhere(search?: string) {
    if (!search) {
      return {};
    }

    return {
      OR: [
        { title: { contains: search } },
        { description: { contains: search } },
        { content: { contains: search } },
      ],
    };
  }

  private async paginatedFind(params: {
    where: Record<string, unknown>;
    query: NewsQueryDto;
    orderBy: Record<string, 'asc' | 'desc'>;
  }) {
    const page = params.query.page ?? 1;
    const limit = Math.min(params.query.limit ?? 10, 50);
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.news.findMany({
        where: params.where,
        orderBy: params.orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          author: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.news.count({ where: params.where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async ensureExists(id: number): Promise<void> {
    const news = await this.prisma.news.findUnique({ where: { id } });
    if (!news) {
      throw new NotFoundException('News not found');
    }
  }

  private buildSlug(title: string): string {
    return `${slugify(title, { lower: true, strict: true })}-${Date.now()}`;
  }
}
