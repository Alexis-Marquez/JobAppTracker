// routes/logout.tsx
import { useEffect } from "react";
import { useAuth } from "@/lib/auth"; // Or wherever your logout logic lives
import FullScreenLoader from "@/components/FullScreenLoader";
import { useNavigate } from "react-router";

export const Logout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout(); 
                navigate("/login");
            } catch (error) {
                console.error("Logout failed", error);
                navigate("/");
            }
        };

        performLogout();
    }, [logout, navigate]);

    return (
        <div className="logout-screen">
            <FullScreenLoader />
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                Signing you out safely...
            </p>
        </div>
    );
};