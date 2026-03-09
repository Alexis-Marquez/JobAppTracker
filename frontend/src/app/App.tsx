import './App.css'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router";
import {AuthProvider} from "@/lib/auth";
import {Login} from "@/app/routes/landingPage/Login";
import {Home} from "@/app/routes/home/Home";
import {LandingPage} from "@/app/routes/landingPage/LandingPage";
import { queryClient } from "@/lib/react-query-client";
import {CreateApplicationPage} from "@/app/routes/createApplication/CreateApplicationPage";
import { InsightsPageHome } from './routes/InsightsPages/InsightsPageHome';

function App() {
    return (
        <>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LandingPage />} />
                    <Route path="/insights" element={<InsightsPageHome />} />
                    <Route path="/create" element={<CreateApplicationPage/>}/>
                </Routes>
                </AuthProvider>
                </BrowserRouter>
        </QueryClientProvider>
        </>

    )
}

export default App
