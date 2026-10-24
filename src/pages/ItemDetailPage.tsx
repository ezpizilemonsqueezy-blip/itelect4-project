import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getItemById, type ItemRecord } from "../api/client";

type ItemDetailParams = { itemId?: string } & Record<string, string | undefined>;

export default function ItemDetailPage() {
  const { itemId } = useParams<ItemDetailParams>();

  const { data: item, isLoading, isError } = useQuery<ItemRecord>({
    queryKey: ["item", itemId],
    queryFn: () => getItemById(String(itemId)),
    enabled: Boolean(itemId),
  });

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Item detail</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Recovered item record</h2>
        <p className="mt-3 text-slate-600">
          Viewing item: <span className="font-semibold text-slate-900">{itemId ?? "unassigned"}</span>
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">Loading item…</div>
      ) : isError || !item ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">Unable to load this item.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Name</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{item.name}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{item.status}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Location</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{item.location}</p>
          </div>
        </div>
      )}
    </section>
  );
}
