import { Injectable, NotFoundException } from '@nestjs/common';
import { BookDto } from './dto/book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
    // comentario: almacenamiento en memoria (mock)
    private books: BookDto[] = [
        { id: '1', title: 'Clean Architecture', author: 'Robert C. Martin', year: 2017 },
        { id: '2', title: 'Refactoring', author: 'Martin Fowler', year: 2018 },
    ];

    findPublic(): BookDto[] {
        // comentario: listado público (puedes filtrar campos si quieres)
        return this.books;
    }

    findAdmin(): BookDto[] {
        // comentario: listado privado (misma data; en real podrías ampliar)
        return this.books;
    }

    findOne(id: string): BookDto {
        const found = this.books.find(b => b.id === id);
        if (!found) throw new NotFoundException('Book not found');
        return found;
    }

    create(dto: CreateBookDto): BookDto {
        const id = (this.books.length + 1).toString();
        const book: BookDto = { id, ...dto };
        this.books.push(book);
        return book;
    }

    update(id: string, dto: UpdateBookDto): BookDto {
        const idx = this.books.findIndex(b => b.id === id);
        if (idx < 0) throw new NotFoundException('Book not found');
        this.books[idx] = { ...this.books[idx], ...dto };
        return this.books[idx];
    }

    remove(id: string): void {
        const idx = this.books.findIndex(b => b.id === id);
        if (idx < 0) throw new NotFoundException('Book not found');
        this.books.splice(idx, 1);
    }
}
