import {useAuth} from "@/lib/auth";

import { useState } from "react";
import { useApplicationsQuery } from "@/features/applications/api/get_applications";
import {Application} from "@/types/api";
import {ApplicationList} from "@/app/routes/home/components/ApplicationList";

export const Home = () => {
    return <ApplicationList></ApplicationList>
}
