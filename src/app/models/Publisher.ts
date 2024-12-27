export interface Publisher {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface PublisherPaginated {
    data: Publisher[];
    total_count: number;
}