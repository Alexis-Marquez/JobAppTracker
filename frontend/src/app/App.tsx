import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router";
import {AuthProvider} from "@/lib/auth";
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
                    <Route path="/Home" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/insights" element={<InsightsPageHome />} />
                    <Route path="/create" element={<CreateApplicationPage/>}/>
                    <Route path="/about" element={<About />} />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
                </AuthProvider>
                <Routes>
                    <Route path="/" element={<LandingPage/>} />
                </Routes>
                </BrowserRouter>
        </QueryClientProvider>
        </>

    )
}

export default App
