import { useParams } from "react-router-dom";

type ItemDetailParams = { itemId?: string } & Record<string, string | undefined>;

export default function ItemDetailPage() {
  const { itemId } = useParams<ItemDetailParams>();

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Item detail</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Recovered item record</h2>
        <p className="mt-3 text-slate-600">
          Viewing item: <span className="font-semibold text-slate-900">{itemId ?? "unassigned"}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Status</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">Recovered</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Claimed</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">1</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Storage</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">Locker B</p>
        </div>
      </div>
    </section>
  );
}
