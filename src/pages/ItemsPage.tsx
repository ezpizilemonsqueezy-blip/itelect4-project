import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { getItems, type ItemRecord } from "../api/client";
import { useUiStore } from "../store/uiStore";

export default function ItemsPage() {
  const location = useLocation();
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);

  const { data: items = [], isLoading, isError } = useQuery<ItemRecord[]>({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const filteredItems = useMemo(
    () =>
      items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [items, searchTerm]
  );

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="item-search" className="block text-sm font-medium text-slate-700">
          Search items
        </label>
        <input
          id="item-search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Find an item"
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">
        Current route: {location.pathname}
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">Loading items…</div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">Unable to load items.</div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-600">
          No matching items found.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-amber-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                  {item.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Category: {item.category}</p>
                <p>Location: {item.location}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
