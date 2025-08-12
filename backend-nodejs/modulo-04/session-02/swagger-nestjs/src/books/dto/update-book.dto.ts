import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateBookDto {
    @ApiPropertyOptional({ example: 'Refactoring' })
    @IsOptional()
    @IsString()
    @MinLength(2)
    title?: string;

    @ApiPropertyOptional({ example: 'Martin Fowler' })
    @IsOptional()
    @IsString()
    @MinLength(2)
    author?: string;

    @ApiPropertyOptional({ example: 2018 })
    @IsOptional()
    @IsInt()
    @Min(0)
    year?: number;
}
