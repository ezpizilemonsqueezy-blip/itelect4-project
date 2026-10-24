import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">404</p>
      <h2 className="mt-3 text-4xl font-bold text-slate-900">Page not found</h2>
      <p className="mt-3 text-slate-600">The route you requested does not exist.</p>
      <Link to="/" className="mt-6 inline-flex rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-500">
        Back home
      </Link>
    </section>
  );
}
