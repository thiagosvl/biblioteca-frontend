export interface Subject {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

export interface SubjectPaginated {
    data: Subject[];
    total_count: number;
}