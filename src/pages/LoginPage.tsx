import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "../store/authStore";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.email.toLowerCase() !== data.password.toLowerCase(), {
  message: "Password must not match your email",
  path: ["password"],
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = () => {
    login("demo-token-123");
    navigate("/profile", { replace: true });
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Access</p>
      <h2 className="mt-2 text-3xl font-bold text-slate-900">Login to continue</h2>
      <p className="mt-3 text-slate-600">Use the demo login to access the protected dashboard route.</p>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-medium text-slate-900">Current session</p>
        <p className="mt-2 break-all">Token: {token ?? "No token yet"}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email ? <p className="text-sm text-rose-600">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter password" {...register("password")} />
          {errors.password ? <p className="text-sm text-rose-600">{errors.password.message}</p> : null}
        </div>

        <Button type="submit" className="w-full">Login with demo token</Button>
      </form>
    </section>
  );
}
