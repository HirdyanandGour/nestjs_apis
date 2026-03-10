import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsQueryDto } from './dto/news-query.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateNewsDto, @Req() request: Request) {
    const user = request.user as { userId: number };
    return this.newsService.create(dto, user.userId);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNewsDto) {
    return this.newsService.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.newsService.remove(id);
  }

  @Public()
  @Get('latest')
  getLatest(@Query() query: NewsQueryDto) {
    return this.newsService.getLatest(query);
  }

  @Public()
  @Get('breaking')
  getBreaking(@Query() query: NewsQueryDto) {
    return this.newsService.getBreaking(query);
  }

  @Public()
  @Get('trending')
  getTrending(@Query() query: NewsQueryDto) {
    return this.newsService.getTrending(query);
  }

  @Public()
  @Get('category/:categoryId')
  getByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query() query: NewsQueryDto,
  ) {
    return this.newsService.getByCategory(categoryId, query);
  }

  @Public()
  @Get('search')
  search(@Query() query: NewsQueryDto) {
    return this.newsService.search(query);
  }
}
