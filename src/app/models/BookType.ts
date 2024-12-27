export interface BookType {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface BookTypePaginated {
    data: BookType[];
    total_count: number;
}