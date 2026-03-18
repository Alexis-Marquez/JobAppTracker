import {Navigate, useLocation, useNavigate} from "react-router";
import {api, apiLogout} from "@/lib/api/api";
import {z} from "zod";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useAuth } from "./auth";
import { ReactNode } from "react";


type ProtectedRouteProps = {
    children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();
    const token = sessionStorage.getItem("accessToken");
    console.log("ProtectedRoute: user =", user, "isLoading =", isLoading, "token =", token);
    if (token && (isLoading || !user)) {
        return <FullScreenLoader />;
    }
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
};