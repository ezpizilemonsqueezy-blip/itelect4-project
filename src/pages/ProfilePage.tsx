import { useAuthStore } from "../store/authStore";

export default function ProfilePage() {
  const token = useAuthStore((state) => state.token);

  return (
    <section className="panel rise mx-auto max-w-2xl p-8">
      <p className="eyebrow">Profile</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Your desk pass</h1>

      <div className="mt-6 rounded-2xl border border-dashed border-line p-4 text-sm">
        <p className="font-mono text-xs tracking-[0.16em] text-ink-soft uppercase">Auth token</p>
        <p className="mt-2 font-mono text-xs break-all">{token ?? "No active token"}</p>
      </div>
    </section>
  );
}
