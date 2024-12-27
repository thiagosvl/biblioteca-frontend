export interface Book {
    id?: number;
    title: string;
    classification: string;
    shelf: string;
    country: string;
    city: string;
    edition: string;
    quantity: number;
    language: string;
    page_count: number;
    year: number;
    isbn: string;
    entry_date: Date;
    tomb_date: Date;
    observations: string;
    author_id: number;
    publisher_id: number;
    collection_id?: number;
    book_type_id: number;
    subject_id: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface BookPaginated {
    data: Book[];
    total_count: number;
}