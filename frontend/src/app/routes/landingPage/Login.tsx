import {LoginInput, loginInputSchema, useLoginWithUsernameAndPassword} from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "./styles.css"

export function Login() {
    const { mutate: login, isPending, isSuccess, error } = useLoginWithUsernameAndPassword();

    const {
            register,
            handleSubmit,
            formState: { errors },
            reset,
        } = useForm<LoginInput>({
            resolver: zodResolver(loginInputSchema),
            defaultValues: {
                username: "",
                password:""
            },
        });
    const onSubmit = (data: LoginInput) => {
        login(data, {
            onSuccess: () => {
                reset();
            },
            onError: () => {
                reset();
            }
        });
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="log-in-form">
            <div className="log-in-form-section">
            <h2 className="title">Login</h2>
            </div>
            <div className="log-in-form-section">
                <label className="log-in-label" htmlFor="username">Username</label>
                <input type="text" {...register("username")} className="log-in-input" id='username'/>
                {errors.username && <p className="log-in-error">{errors.username.message}</p>}
            </div>

            <div className="log-in-form-section">
                <label className="log-in-label" htmlFor="password">Password</label>
                <input type="password" {...register("password")} className="log-in-input" id="password" />
                {errors.password && <p className="log-in-error">{errors.password.message}</p>}
            </div>
            <div className="log-in-form-section">
            <button type="submit" disabled={isPending} className="log-in-button">
                {isPending ? "Submitting..." : "Log in"}
            </button>
                <p className="sub-title">Don't have an account? <a>register</a></p>
            </div>
        </form>
            )
}


