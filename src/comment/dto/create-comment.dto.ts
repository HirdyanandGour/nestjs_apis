import { IsInt, IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  newsId: number;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  comment: string;
}
