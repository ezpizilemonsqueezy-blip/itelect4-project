import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

interface LostItem {
  id: string;
  name: string;
  category: "Electronics" | "Accessories" | "Documents" | "Personal";
  status: "Recovered" | "Claimed" | "Awaiting Pickup";
  location: string;
}

const MOCK_ITEMS: LostItem[] = [
  {
    id: "item-101",
    name: "Black Water Bottle",
    category: "Personal",
    status: "Recovered",
    location: "Main entrance desk",
  },
  {
    id: "item-102",
    name: "Silver USB-C Cable",
    category: "Electronics",
    status: "Awaiting Pickup",
    location: "Library counter",
  },
  {
    id: "item-103",
    name: "Student ID",
    category: "Documents",
    status: "Claimed",
    location: "Security office",
  },
];

export default function ItemsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(
    () =>
      MOCK_ITEMS.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-slate-600 md:col-span-2 xl:col-span-3">
            No matching items found.
          </div>
        ) : (
          filteredItems.map((item) => (
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
          ))
        )}
      </div>
    </section>
  );
}
