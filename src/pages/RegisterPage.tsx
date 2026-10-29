import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAccount, registerAccount } from "../api/client";
import { useAuthStore } from "../store/authStore";

// Same rules as POST /api/auth/register, so most mistakes are caught before the request.
const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name must be under 80 characters"),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const mutation = useMutation({
    // Register returns only the user, so sign in right after to get a token.
    mutationFn: async ({ name, email, password }: RegisterForm) => {
      await registerAccount(name, email, password);
      return loginAccount(email, password);
    },
    onSuccess: ({ token }) => {
      login(token);
      navigate("/items", { replace: true });
    },
  });
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Campus Recovery Desk</p>
      <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Create your account</h2>
      <p className="mt-3 text-slate-600 dark:text-slate-300">New accounts start with the student role.</p>

      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="mt-6 space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" autoComplete="name" placeholder="Your name" {...register("name")} />
          {errors.name && <p className="text-sm text-rose-600">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-sm text-rose-600">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" {...register("password")} />
          {errors.password && <p className="text-sm text-rose-600">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-sm text-rose-600">{errors.confirmPassword.message}</p>}
        </div>
        {mutation.isError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{mutation.error.message}</p>}
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Sign in</Link>
      </p>
    </section>
  );
}
