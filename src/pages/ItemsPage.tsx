import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flashlight as FlashlightIcon, Search } from "lucide-react";
import { getCategories, getItems, type ItemCategory, type ItemRecord } from "../api/client";
import Flashlight from "../components/Flashlight";
import ItemTag from "../components/ItemTag";
import { useUiStore } from "../store/uiStore";

export default function ItemsPage() {
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const [category, setCategory] = useState<ItemCategory | "All">("All");
  const [lightsOut, setLightsOut] = useState(false);

  const { data: items = [], isLoading, isError } = useQuery<ItemRecord[]>({
    queryKey: ["items"],
    queryFn: getItems,
  });
  // The filter chips come from the same public categories endpoint as the add-item dropdown.
  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: getCategories });

  const filteredItems = useMemo(
    () =>
      items.filter(
        (item) =>
          (category === "All" || item.category === category) &&
          `${item.name} ${item.location} ${item.description}`.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [items, searchTerm, category],
  );

  const chips: (ItemCategory | "All")[] = ["All", ...categories.map((entry) => entry.name)];

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">The shelf</p>
          <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight">Recovered items</h1>
        </div>
        <button type="button" onClick={() => setLightsOut((value) => !value)} aria-pressed={lightsOut} className={lightsOut ? "btn-signal" : "btn-ghost"}>
          <FlashlightIcon className="size-4" />
          {lightsOut ? "Lights on" : "Search with a flashlight"}
        </button>
      </header>

      <div className="panel flex flex-col gap-4 p-4 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search items</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, place or description"
            className="field pl-9"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setCategory(chip)}
              aria-pressed={category === chip}
              className={`rounded-full border px-3 py-1.5 font-mono text-xs tracking-wide transition-colors ${
                category === chip ? "border-ink bg-ink text-paper" : "border-line text-ink-soft hover:text-ink"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="panel p-6 font-mono text-sm text-ink-soft">Scanning the shelf…</p>
      ) : isError ? (
        <p className="panel p-6 text-bad">Unable to load items.</p>
      ) : (
        <Flashlight on={lightsOut}>
          {filteredItems.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-line p-10 text-center text-ink-soft">Nothing on the shelf matches that. Try another word.</p>
          ) : (
            <ul className="grid gap-x-6 gap-y-6 px-1 pb-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, index) => (
                <ItemTag key={item.id} item={item} index={index} />
              ))}
            </ul>
          )}
        </Flashlight>
      )}
    </section>
  );
}
