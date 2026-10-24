export default function ReportsPage() {
  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Reports</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Item activity</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Recovered</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">18</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending claims</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">7</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">This week</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">11</p>
        </div>
      </div>
    </section>
  );
}
