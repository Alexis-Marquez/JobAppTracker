import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router";
import {AuthProvider, PublicRoute} from "@/lib/auth";
import {ProtectedRoute} from "@/lib/protected-route";
import {Login} from "@/app/routes/login-page/Login";
import {Home} from "@/app/routes/home/Home";
import {LoginPage} from "@/app/routes/login-page/LoginPage";
import { queryClient } from "@/lib/react-query-client";
import {CreateApplicationPage} from "@/app/routes/create-application/CreateApplicationPage";
import { InsightsPageHome } from './routes/insights-pages/InsightsPageHome';
import { About } from '@/app/routes/about/About';
import { R } from '@tanstack/react-query-devtools/build/legacy/ReactQueryDevtools-Cn7cKi7o';
import { Logout } from './routes/logout/Logout';
import {LandingPage} from '@/app/routes/landing-page/LandingPage';

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
                                <Logout />
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
                        <Route
                        path="/create-application"
                        element={
                            <ProtectedRoute>
                            <CreateApplicationPage />
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
