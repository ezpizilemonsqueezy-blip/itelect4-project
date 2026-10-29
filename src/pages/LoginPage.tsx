import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { loginAccount } from "../api/client";
import PassCard from "../components/PassCard";
import { useAuthStore } from "../store/authStore";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  // Set by ProtectedRoute, e.g. "/claims?itemId=..." after clicking "Claim this item".
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/items";
  const mutation = useMutation({
    mutationFn: ({ email, password }: LoginForm) => loginAccount(email, password),
    onSuccess: ({ token }) => {
      login(token);
      navigate(from, { replace: true, viewTransition: true });
    },
  });
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <PassCard
      eyebrow="Visitor pass"
      title="Welcome back"
      subtitle="Sign in to claim an item, tag something you found, or review claims on your items."
      footer={
        <>
          New to the desk?{" "}
          <Link to="/register" state={{ from }} viewTransition className="font-semibold text-signal hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4" noValidate>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Email</span>
          <input className="field" type="email" autoComplete="email" placeholder="you@school.edu" {...register("email")} />
          {errors.email && <span className="block text-sm text-bad">{errors.email.message}</span>}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Password</span>
          <input className="field" type="password" autoComplete="current-password" {...register("password")} />
          {errors.password && <span className="block text-sm text-bad">{errors.password.message}</span>}
        </label>
        {mutation.isError && <p role="alert" className="rounded-xl border border-bad/30 bg-bad/10 p-3 text-sm text-bad">{mutation.error.message}</p>}
        <button type="submit" className="btn-signal w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Checking your pass…" : "Sign in"}
        </button>
      </form>
    </PassCard>
  );
}
