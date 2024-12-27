export interface Collection {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}

export interface CollectionPaginated {
    data: Collection[];
    total_count: number;
}