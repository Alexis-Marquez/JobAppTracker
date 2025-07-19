import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createApplicationInputSchema, CreateApplicationInput, useCreateApplication } from "@/features/applications/api/create-application";
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
            <div className="form-section">
                <div className="form-group">
                    <label>Position Title</label>
                    <input type="text" {...register("position_title")} />
                    {errors.position_title && <p className="error-message">{errors.position_title.message}</p>}
                </div>
                <div className="form-group">
                    <label>Posting Url</label>
                    <input type="url" {...register("posting_url")} />
                    {errors.posting_url && <p className="error-message">{errors.posting_url.message}</p>}
                </div>
            </div>
            <div className="form-section">
                <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" {...register("company_data.name")}/>
                    {errors.company_data?.name && <p className="error-message">{errors.company_data.name.message}</p>}
                </div>
                <div className="form-group">
                    <label>Company Website</label>
                    <input type="url" {...register("company_data.website")} />
                    {errors.company_data?.website && <p className="error-message">{errors.company_data.website.message}</p>}
                </div>
                <div className="form-group">
                    <label>Location Type</label>
                    <select {...register("location_data.location_type")} className="border p-2 w-full">
                        <option value="ONSITE">Onsite</option>
                        <option value="REMOTE">Remote</option>
                        <option value="HYBRID">Hybrid</option>
                    </select>
                </div>
            </div>
            {locationType !== "REMOTE" && (
                <div className="form-section">
                    <div className="form-group">
                        <label>City</label>
                        <input type="text" {...register("location_data.city")}/>
                        {errors.location_data?.city && <p className="error-message">{errors.location_data.city.message}</p>}
                    </div>

                    <div className="form-group">
                        <label>State</label>
                        <input type="text" {...register("location_data.state")} />
                    </div>

                    <div className="form-group">
                        <label>Country</label>
                        <input type="text" {...register("location_data.country")} />
                    </div>
                </div>
            )}
            <div className="form-section">
                <div className="form-group">
                    <label>Application Date</label>
                    <input type="date" {...register("application_date", { valueAsDate: true })}/>
                    {errors.application_date && <p className="error-message">{errors.application_date.message}</p>}
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select {...register("status")}>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea {...register("description")} rows={4} />
                </div>
            </div>
            <div className="button-container">
                <button type="submit" disabled={isPending} className="submit-button">
                    {isPending ? "Submitting..." : "Create Application"}
                </button>
            </div>
        </form>
    );
};
