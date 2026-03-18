import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createApplicationInputSchema, CreateApplicationInput, useCreateApplication } from "@/features/applications/api/create_application";
import { z } from "zod";
import {useNavigate} from "react-router";

import { useEffect } from "react";
import "./CreateApplicationForm.css"

export const CreateApplicationForm = () => {
    const { mutate, isPending } = useCreateApplication();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
        setValue,
    } = useForm<CreateApplicationInput>({
        resolver: zodResolver(createApplicationInputSchema),
        defaultValues: {
            position_title: "",
            company_data: { name: "", website: "" },
            location_data: { city: "", state: "", country: "", location_type: "ONSITE" },
            application_date: new Date(),
            status: "applied",
            description: "",
            posting_url: "",
        },
    });

    const locationType = watch("location_data.location_type");

    const onSubmit = (data: CreateApplicationInput) => {
        mutate(data, {
            onSuccess: () => {
                reset();
                alert("Application created!");
                navigate("/");
            },
        });
    };
    useEffect(() => {
        if (locationType === "REMOTE") {
            setValue("location_data.city", "");
            setValue("location_data.state", "");
            setValue("location_data.country", "");
        }
    }, [locationType, setValue]);


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
            <h2 className="form-title">New Application</h2>
            <div className="form-section">
                <div className="form-group">
                    <label htmlFor="position_title">Position Title</label>
                    <input type="text" id="position_title" {...register("position_title")} />
                    {errors.position_title && <p className="error-message">{errors.position_title.message}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="posting_url">Posting Url</label>
                    <input type="url" id="posting_url" {...register("posting_url")} />
                    {errors.posting_url && <p className="error-message">{errors.posting_url.message}</p>}
                </div>
            </div>
            <div className="form-section">
                <div className="form-group">
                    <label htmlFor="company_name">Company Name</label>
                    <input type="text" id="company_name" {...register("company_data.name")}/>
                    {errors.company_data?.name && <p className="error-message">{errors.company_data.name.message}</p>}
                </div>
                
                <div className="form-group">
                    <label htmlFor="location_type">Location Type</label>
                    <select id="location_type" {...register("location_data.location_type")} className="border p-2 w-full">
                        <option value="ONSITE">Onsite</option>
                        <option value="REMOTE">Remote</option>
                        <option value="HYBRID">Hybrid</option>
                    </select>
                </div>
            </div>
            {locationType !== "REMOTE" && (
                <div className="form-section location-grid">
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" {...register("location_data.city")}/>
                        {errors.location_data?.city && <p className="error-message">{errors.location_data.city.message}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="state">State</label>
                        <input type="text" id="state" {...register("location_data.state")} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input type="text" id="country" {...register("location_data.country")} />
                    </div>
                </div>
            )}
            <div className="form-section">
                <div className="form-group">
                    <label htmlFor="application_date">Application Date</label>
                    <input type="date" id="application_date" {...register("application_date", { valueAsDate: true })}/>
                    {errors.application_date && <p className="error-message">{errors.application_date.message}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select id="status" {...register("status")}>
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interview</option>
                        <option value="offered">Offer</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                        <option value="accepted">Accepted</option>
                    </select>
                </div>

                
            </div>
            <div className="button-container">
                <button type="submit" disabled={isPending} className="submit-button">
                    {isPending ? "Submitting..." : "Create Application"}
                </button>
                <button type="button" onClick={() => navigate("/")} className="cancel-button">
                    Cancel
                </button>
            </div>
        </form>
    );
};
