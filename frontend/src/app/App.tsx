import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router";
import {AuthProvider, ProtectedRoute, PublicRoute} from "@/lib/auth";
import {Login} from "@/app/routes/Login/Login";
import {Home} from "@/app/routes/home/Home";
import {LoginPage} from "@/app/routes/Login/LoginPage";
import { queryClient } from "@/lib/react-query-client";
import {CreateApplicationPage} from "@/app/routes/createApplication/CreateApplicationPage";
import { InsightsPageHome } from './routes/InsightsPages/InsightsPageHome';
import { About } from '@/app/routes/about/About';
import { R } from '@tanstack/react-query-devtools/build/legacy/ReactQueryDevtools-Cn7cKi7o';
import { Logout } from './routes/logout/Logout';
import {LandingPage} from '@/app/routes/LandingPage/LandingPage';

function App() {
    return (
        <>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>

                        {/* PUBLIC */}
                        <Route path="/" element={
                            <PublicRoute>
                                <LandingPage />
                            </PublicRoute>
                        } />
                        <Route path="/login" element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        } />
                        {/* <Route path="/signup" element={<Signup />} /> */}
                        <Route path="/logout" element={
                            <PublicRoute>
                                <Logout />
                            </PublicRoute>
                        } />
                        {/* PROTECTED */}
                        <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                            <Home />
                            </ProtectedRoute>
                        }
                        />

                        <Route
                        path="/stats"
                        element={
                            <ProtectedRoute>
                            <InsightsPageHome />
                            </ProtectedRoute>
                        }
                        />
                        <Route
                        path="/about"
                        element={
                            <ProtectedRoute>
                            <About />
                            </ProtectedRoute>
                        }
                        />
                    </Routes>
                    </AuthProvider>
                </BrowserRouter>
        </QueryClientProvider>
        </>

    )
}

export default App
