import { ApiProperty } from '@nestjs/swagger';

export class BookDto {
    @ApiProperty({ example: '1' })
    id: string;

    @ApiProperty({ example: 'Clean Architecture' })
    title: string;

    @ApiProperty({ example: 'Robert C. Martin' })
    author: string;

    @ApiProperty({ example: 2017 })
    year: number;
}
