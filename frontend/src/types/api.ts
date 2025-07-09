export type BaseEntity = {
    id: string;
    createdAt: number;
};

export type Entity<T> = T & BaseEntity;

export type Application = Entity<{
    position_title: string;
    company_data: {
        company_name: string;
        company_website?: string;
    };
    location_data: {
        city: string;
        state?: string;
        country?: string;
        location_type: 'ONSITE' | 'REMOTE' | 'HYBRID';
    };
    application_date: Date;
    status?: 'applied' | 'interview' | 'offer' | 'rejected';
    description?: string;
}>;
