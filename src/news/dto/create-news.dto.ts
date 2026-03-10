import { IsBoolean, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsString()
  @MinLength(20)
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsBoolean()
  isBreaking?: boolean;

  @IsOptional()
  @IsBoolean()
  isTrending?: boolean;
}
