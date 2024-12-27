export interface Author {
    id: number;
    full_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface AuthorPaginated {
    data: Author[];
    total_count: number;
}