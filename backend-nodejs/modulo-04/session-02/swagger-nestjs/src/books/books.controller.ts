import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { BookDto } from './dto/book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DummyJwtGuard } from '../common/guards/dummy-jwt.guard';

@ApiTags('Books')
@Controller('books')
export class BooksController {
    constructor(private readonly books: BooksService) {}

    @Get()
    @ApiOperation({ summary: 'List public books' })
    @ApiResponse({ status: 200, type: [BookDto] })
    findPublic(): BookDto[] {
        return this.books.findPublic();
    }

    @Get('admin')
    @UseGuards(DummyJwtGuard)
    @ApiBearerAuth('bearer')
    @ApiOperation({ summary: 'List private books (admin)' })
    @ApiResponse({ status: 200, type: [BookDto] })
    findAdmin(): BookDto[] {
        return this.books.findAdmin();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get book by id' })
    @ApiResponse({ status: 200, type: BookDto })
    @ApiResponse({ status: 404, description: 'Not Found' })
    findOne(@Param('id') id: string): BookDto {
        return this.books.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create book' })
    @ApiResponse({ status: 201, type: BookDto })
    create(@Body() dto: CreateBookDto): BookDto {
        return this.books.create(dto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update book' })
    @ApiResponse({ status: 200, type: BookDto })
    update(@Param('id') id: string, @Body() dto: UpdateBookDto): BookDto {
        return this.books.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete book' })
    @ApiResponse({ status: 204, description: 'No Content' })
    remove(@Param('id') id: string): void {
        this.books.remove(id);
    }
}
