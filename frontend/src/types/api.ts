export type BaseEntity = {
    id: string;
    createdAt: number;
};

export type Entity<T> = T & BaseEntity;

export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected';


export type HistoryEntry = {
    old_status: ApplicationStatus;
    new_status: ApplicationStatus;
    changed_at: string; // ISO timestamp
};


export type Application = {
    id: number;
    position_title: string;
    company: {
        name: string;
        website?: string;
    };
    location: {
        id: number;
        city: string;
        state?: string;
        country?: string;
        location_type: 'onsite' | 'remote' | 'hybrid';
    };
    application_date: string;
    status?: ApplicationStatus;
    description?: string;
    benefits?: string;
    posting_url?: string;
    resume_used?: any;
    user?: number;
    history?: HistoryEntry[];
    is_active?: boolean;
    days_since_applied?: number;
    last_updated?: string;
    pay?: string;
    requirements?: string;
};

export type GetApplicationsResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Application[];
};

export type User = {
    email: string;
    first_name: string;
    id: string
    last_name: string;
    username: string;
}

export type AuthContextType = {
    user: User | null;
    logout: () => Promise<void>;
};

export type AuthResponse = {
    access: string;
};

export type RefreshTokenResponse = {
    access: string;
};

export type ApplicationsFilters = {
    status?: string;
    page?: number;
    search?: string;
};