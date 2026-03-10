import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { CommentService } from './comment.service';
import { CommentQueryDto } from './dto/comment-query.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateCommentDto) {
    return this.commentService.create(dto);
  }

  @Public()
  @Get('news/:newsId')
  findByNews(
    @Param('newsId', ParseIntPipe) newsId: number,
    @Query() query: CommentQueryDto,
  ) {
    return this.commentService.findByNews(newsId, query);
  }
}
