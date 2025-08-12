import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateBookDto {
    @ApiProperty({ example: 'Clean Architecture' })
    @IsString()
    @MinLength(2)
    title: string;

    @ApiProperty({ example: 'Robert C. Martin' })
    @IsString()
    @MinLength(2)
    author: string;

    @ApiProperty({ example: 2017 })
    @IsInt()
    @Min(0)
    year: number;
}
