import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-100">Lost & Found</p>
        <h2 className="mt-3 text-4xl font-bold">Recovered items hub</h2>
        <p className="mt-3 max-w-2xl text-amber-50">
          Track reported belongings, review claim requests, and help reunite every item with its rightful owner.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/items" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm font-medium text-slate-500">Items</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">24</p>
          <p className="mt-2 text-sm text-slate-600">Items logged this week</p>
        </Link>
        <Link to="/claims" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm font-medium text-slate-500">Claims</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">8</p>
          <p className="mt-2 text-sm text-slate-600">Pending verification</p>
        </Link>
        <Link to="/login" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <p className="text-sm font-medium text-slate-500">Access</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">Staff</p>
          <p className="mt-2 text-sm text-slate-600">Protected admin mode</p>
        </Link>
      </div>
    </section>
  );
}
