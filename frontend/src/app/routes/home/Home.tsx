import {useAuth} from "@/lib/auth";

import { useState } from "react";
import { useApplicationsQuery } from "@/features/applications/api/get_applications";
import {Application} from "@/types/api";
import {ApplicationList} from "@/app/routes/home/components/ApplicationList";
import {Navbar} from "@/app/routes/home/components/Navbar";

export const Home = () => {
    return (
        <div className="container-page">
        <Navbar></Navbar>
        <ApplicationList></ApplicationList>
        </div>
    )
}
