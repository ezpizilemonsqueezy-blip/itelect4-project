import { useAuthStore } from "../store/authStore";

export default function ProfilePage() {
  const token = useAuthStore((state) => state.token);

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Profile</p>
      <h2 className="mt-2 text-3xl font-bold text-slate-900">Studio account</h2>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-medium text-slate-900">Auth token</p>
        <p className="mt-2 break-all">{token ?? "No active token"}</p>
      </div>
    </section>
  );
}
