import {useContext, createContext, ReactNode} from "react";
import {AuthContextType, AuthResponse, User} from "@/types/api";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {RefreshTokenResponse} from "@/types/api"

export const getUser = async (): Promise<User | null> => {
    try {
        const response = await api.get('/users/') as User | null;
        return response || null;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null; 
    }
};

export const loginInputSchema = z.object({
    username: z.string().min(1, 'Username is Required'),
    password: z.string().min(1, 'Password is Required'),
});


export const refreshToken: () => Promise<RefreshTokenResponse> = () => {
    return api.post('/token/refresh/', null, {
        headers: {
            Authorization: undefined,
        },
    });
};

export type LoginInput = z.infer<typeof loginInputSchema>;

export const loginWithUsernameAndPassword = (data: LoginInput): Promise<AuthResponse> => {
    return api.post('/token/', data);
};



export const useLoginWithUsernameAndPassword = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: loginWithUsernameAndPassword,
        mutationKey: ['currentUser'],
        onSuccess: (data) => {
            sessionStorage.setItem('accessToken', data.access);
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            navigate('/home');
        }
    });
}


const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

type AuthProviderProps = {
    children: ReactNode;
};

type ProtectedRouteProps = {
    children: ReactNode;
};

export const AuthProvider = ({children}: ProtectedRouteProps) => {
    const queryClient = useQueryClient();
    const location = useLocation();
    const { data, isLoading } = useQuery({
        queryKey: ["currentUser"],
        queryFn: getUser,
        enabled: !!sessionStorage.getItem("accessToken"),
        retry: false,
    });

    const logout = async () => {
    try {
        await queryClient.cancelQueries();
        await apiLogout();
    } finally {
        sessionStorage.removeItem("accessToken");
        queryClient.clear();
    }
};
    const user: User | null = data ?? null;
    return (
        <AuthContext.Provider value={{user, logout, isLoading}}>
            {isLoading ? <FullScreenLoader /> : children}
        </AuthContext.Provider>
    );
};

import {Navigate, useLocation, useNavigate} from "react-router";
import {api, apiLogout} from "@/lib/api/api";
import {z} from "zod";
import FullScreenLoader from "@/components/FullScreenLoader";

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <FullScreenLoader />;
    }

    // If the user is logged in, send them to home
    if (user) {
        return <Navigate to="/home" replace />;
    }

    return children;
};