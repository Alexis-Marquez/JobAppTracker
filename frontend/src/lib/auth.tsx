import {useContext, createContext, ReactNode} from "react";
import {AuthContextType, AuthResponse, User} from "@/types/api";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {RefreshTokenResponse} from "@/types/api"

const getUser = async (): Promise<User> => {
    const response = await api.get('/users/');
    return response.data;
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

const loginWithUsernameAndPassword = (data: LoginInput): Promise<AuthResponse> => {
    return api.post('/token/', data);
};

export const useLoginWithUsernameAndPassword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: loginWithUsernameAndPassword,
        mutationKey: ['currentUser'],
        onSuccess: (data) => {
            sessionStorage.setItem('accessToken', data.access);
            queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            queryClient.invalidateQueries({ queryKey: ['applications'] });
            window.location.href = '/';
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
        enabled: location.pathname !== "/login/",
        retry: false,
        staleTime: 30 * 60 * 1000,
    });

    const logout = async () => {
        await apiLogout();
        sessionStorage.removeItem("accessToken");
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        queryClient.clear();
    };
    const user: User | null = data ?? null;

    return (
        <AuthContext.Provider value={{user, logout }}>
            {isLoading ? <FullScreenLoader /> : children}
        </AuthContext.Provider>
    );
};

import {Navigate, useLocation} from "react-router";
import {api, apiLogout} from "@/lib/api/api-client";
import {z} from "zod";
import FullScreenLoader from "@/components/FullScreenLoader";


export const ProtectedRoute = ({ children }: AuthProviderProps) => {
    const { user } = useAuth();

    if (!user) {
        // If not authenticated, redirect to login page
        return <Navigate to="/login/" replace />;
    }
    // If authenticated, render the child route component
    return children;
};