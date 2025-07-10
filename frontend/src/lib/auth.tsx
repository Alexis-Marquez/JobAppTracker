import {useState, useContext, createContext, ReactNode, SetStateAction} from "react";
import {AuthContextType, AuthResponse, User} from "@/types/api";
import {useQuery, useQueryClient} from "@tanstack/react-query";

const getUser = async (): Promise<User> => {
    const response = await api.get('/users');

    return response.data;
};

export const loginInputSchema = z.object({
    username: z.string().min(1, 'Required'),
    password: z.string().min(1, 'Required'),
});


export const refreshToken = () => {
    return api.post('/token/refresh/');
};

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithEmailAndPassword = (data: LoginInput): Promise<AuthResponse> => {
    return api.post('/token', data);
};

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
    const [user, setUser] = useState<User | null>(null);
    const queryClient = useQueryClient();

    const initialCallOptions = ()=>({
        queryKey: ["currentUser"],
        queryFn: getUser,
        onSuccess: (response: User) => {
            setUser(response);
        },
        onError: () => {
            setUser(null);
        },
    })

    const { isLoading } = useQuery(initialCallOptions());


    const logout = async () => {
        await apiLogout();
        localStorage.removeItem("accessToken");
        setUser(null);
        queryClient.clear();
    };
    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {isLoading ? <FullScreenLoader /> : children}
        </AuthContext.Provider>
    );
};

import { Navigate } from "react-router";
import {api, apiLogout} from "@/lib/api/api-client";
import {z} from "zod";
import FullScreenLoader from "@/components/FullScreenLoader";


export const ProtectedRoute = ({ children }: AuthProviderProps) => {
    const { user } = useAuth();

    if (!user) {
        // If not authenticated, redirect to login page
        return <Navigate to="/login" replace />;
    }
    // If authenticated, render the child route component
    return children;
};