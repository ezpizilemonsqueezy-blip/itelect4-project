import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { loginAccount, registerAccount } from "../api/client";
import PassCard from "../components/PassCard";
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
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/items";
  const mutation = useMutation({
    // Register returns only the user, so sign in right after to get a token.
    mutationFn: async ({ name, email, password }: RegisterForm) => {
      await registerAccount(name, email, password);
      return loginAccount(email, password);
    },
    onSuccess: ({ token }) => {
      login(token);
      navigate(from, { replace: true, viewTransition: true });
    },
  });
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  return (
    <PassCard
      eyebrow="New pass"
      title="Get your desk pass"
      subtitle="Anyone can browse. An account lets you claim what is yours and tag what you find."
      footer={
        <>
          Already have a pass?{" "}
          <Link to="/login" state={{ from }} viewTransition className="font-semibold text-signal hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4" noValidate>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Name</span>
          <input className="field" autoComplete="name" placeholder="Your name" {...register("name")} />
          {errors.name && <span className="block text-sm text-bad">{errors.name.message}</span>}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">Email</span>
          <input className="field" type="email" autoComplete="email" placeholder="you@school.edu" {...register("email")} />
          {errors.email && <span className="block text-sm text-bad">{errors.email.message}</span>}
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Password</span>
            <input className="field" type="password" autoComplete="new-password" placeholder="8+ characters" {...register("password")} />
            {errors.password && <span className="block text-sm text-bad">{errors.password.message}</span>}
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Confirm</span>
            <input className="field" type="password" autoComplete="new-password" {...register("confirmPassword")} />
            {errors.confirmPassword && <span className="block text-sm text-bad">{errors.confirmPassword.message}</span>}
          </label>
        </div>
        {mutation.isError && <p role="alert" className="rounded-xl border border-bad/30 bg-bad/10 p-3 text-sm text-bad">{mutation.error.message}</p>}
        <button type="submit" className="btn-signal w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Printing your pass…" : "Create account"}
        </button>
      </form>
    </PassCard>
  );
}
