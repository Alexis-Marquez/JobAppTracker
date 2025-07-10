export type BaseEntity = {
    id: string;
    createdAt: number;
};

export type Entity<T> = T & BaseEntity;

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
    status?: 'applied' | 'interview' | 'offer' | 'rejected';
    description?: string;
    benefits?: string;
    resume_used?: any;
    user?: number;
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
    id: string;
    username: string;
}

export type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
};

export type AuthResponse = {
    jwt: string;
};