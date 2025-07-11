import {LoginInput, loginInputSchema, useLoginWithUsernameAndPassword} from "@/lib/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
                alert("Logged in!");
            },
        });
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl mx-auto p-4">
            <div>
                <label>Username</label>
                <input type="text" {...register("username")} className="border p-2 w-full" />
                {errors.username && <p className="text-red-500">{errors.username.message}</p>}
            </div>

            <div>
                <label>Password</label>
                <input type="password" {...register("password")} className="border p-2 w-full" />
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isPending} className="bg-blue-600 text-white py-2 px-4 rounded">
                {isPending ? "Submitting..." : "Log in"}
            </button>
        </form>
            )
}


