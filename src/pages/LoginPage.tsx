import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAccount } from "../api/client";
import { useAuthStore } from "../store/authStore";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: ({ email, password }: LoginForm) => loginAccount(email, password),
    onSuccess: ({ token }) => {
      login(token);
      navigate("/items", { replace: true });
    },
  });
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Campus Recovery Desk</p>
      <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">Sign in</h2>
      <p className="mt-3 text-slate-600 dark:text-slate-300">Sign in to manage items, claims and AI project reviews.</p>

      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="mt-6 space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-sm text-rose-600">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
          {errors.password && <p className="text-sm text-rose-600">{errors.password.message}</p>}
        </div>
        {mutation.isError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{mutation.error.message}</p>}
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        New to the app?{" "}
        <Link to="/register" className="font-semibold text-indigo-600 hover:underline">Create an account</Link>
      </p>
    </section>
  );
}
