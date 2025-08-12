import Router from '@koa/router';
import { books } from '../store';
import { Book, CreateBook, UpdateBook } from '../types';
import { Context } from 'koa';

const router = new Router({ prefix: '/books' });

/**
 * @openapi
 * /api/books:
 *   get:
 *     tags: [Books]
 *     summary: List public books
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/', (ctx: Context) => {
    ctx.body = books;
});

/**
 * @openapi
 * /api/books/admin:
 *   get:
 *     tags: [Books]
 *     summary: List private books (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK (private)
 *       401:
 *         description: Unauthorized
 */
router.get('/admin', (ctx: Context) => {
    // comentario: la protección real se aplica en server.ts con authBearer
    ctx.body = books;
});

/**
 * @openapi
 * /api/books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get book by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Found
 *       404:
 *         description: Not Found
 */
router.get('/:id', (ctx: Context) => {
    const found = books.find(b => b.id === ctx.params.id);
    if (!found) {
        ctx.status = 404;
        ctx.body = { statusCode: 404, error: 'Not Found', message: 'Book not found' };
        return;
    }
    ctx.body = found;
});

/**
 * @openapi
 * /api/books:
 *   post:
 *     tags: [Books]
 *     summary: Create book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateBook' }
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', (ctx: Context) => {
    const body = ctx.request.ctx.body as CreateBook;
    const id = (books.length + 1).toString();
    const book: Book = { id, ...body };
    books.push(book);
    ctx.status = 201;
    ctx.body = book;
});

/**
 * @openapi
 * /api/books/{id}:
 *   patch:
 *     tags: [Books]
 *     summary: Update book
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateBook' }
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not Found
 */
router.patch('/:id', (ctx: Context) => {
    const idx = books.findIndex(b => b.id === ctx.params.id);
    if (idx < 0) {
        ctx.status = 404;
        ctx.body = { statusCode: 404, error: 'Not Found', message: 'Book not found' };
        return;
    }
    const body = ctx.request.ctx.body as UpdateBook;
    books[idx] = { ...books[idx], ...body };
    ctx.body = books[idx];
});

/**
 * @openapi
 * /api/books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete book
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Not Found
 */
router.delete('/:id', (ctx: Context) => {
    const idx = books.findIndex(b => b.id === ctx.params.id);
    if (idx < 0) {
        ctx.status = 404;
        ctx.body = { statusCode: 404, error: 'Not Found', message: 'Book not found' };
        return;
    }
    books.splice(idx, 1);
    ctx.status = 204;
});

export default router;
