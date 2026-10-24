import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAccount, registerAccount } from "../api/client";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const accountSchema = z.object({
  name: z.string().optional(),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type AccountForm = z.infer<typeof accountSchema>;

export default function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async (values: AccountForm) => {
      if (isRegistering) {
        const name = values.name?.trim() ?? "";
        if (name.length < 2) throw new Error("Name must be at least 2 characters.");
        await registerAccount(name, values.email, values.password);
      }
      return loginAccount(values.email, values.password);
    },
    onSuccess: ({ token }) => {
      login(token);
      navigate("/review", { replace: true });
    },
  });
  const { register, handleSubmit, formState: { errors } } = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Campus Recovery Desk</p>
      <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">{isRegistering ? "Create your account" : "Sign in"}</h2>
      <p className="mt-3 text-slate-600 dark:text-slate-300">Sign in to access the protected AI project review.</p>

      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="mt-6 space-y-4">
        {isRegistering && <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" autoComplete="name" required minLength={2} placeholder="Your name" {...register("name")} />
          {errors.name && <p className="text-sm text-rose-600">{errors.name.message}</p>}
        </div>}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" required placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-sm text-rose-600">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete={isRegistering ? "new-password" : "current-password"} required minLength={8} placeholder="At least 8 characters" {...register("password")} />
          {errors.password && <p className="text-sm text-rose-600">{errors.password.message}</p>}
        </div>
        {mutation.isError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{mutation.error.message}</p>}
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Please wait…" : isRegistering ? "Create account" : "Sign in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
        {isRegistering ? "Already have an account?" : "New to the app?"}{" "}
        <button type="button" onClick={() => { mutation.reset(); setIsRegistering((value) => !value); }} className="font-semibold text-indigo-600 hover:underline">
          {isRegistering ? "Sign in" : "Create an account"}
        </button>
      </p>
    </section>
  );
}
