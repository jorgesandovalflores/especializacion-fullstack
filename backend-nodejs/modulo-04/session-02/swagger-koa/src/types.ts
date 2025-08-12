export interface Book {
    id: string;
    title: string;
    author: string;
    year: number;
}
export interface CreateBook {
    title: string;
    author: string;
    year: number;
}
export interface UpdateBook {
    title?: string;
    author?: string;
    year?: number;
}
