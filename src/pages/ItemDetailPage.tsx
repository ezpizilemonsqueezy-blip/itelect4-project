import type { CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getItemById, type ItemRecord } from "../api/client";
import StatusStamp from "../components/StatusStamp";
import { useAuthStore } from "../store/authStore";

type ItemDetailParams = { itemId?: string } & Record<string, string | undefined>;

export default function ItemDetailPage() {
  const { itemId } = useParams<ItemDetailParams>();
  const token = useAuthStore((state) => state.token);

  const { data: item, isLoading, isError } = useQuery<ItemRecord>({
    queryKey: ["item", itemId],
    queryFn: () => getItemById(String(itemId)),
    enabled: Boolean(itemId),
  });

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <Link to="/items" viewTransition className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-ink-soft uppercase hover:text-ink">
        <ArrowLeft className="size-4" /> Back to the shelf
      </Link>

      {isLoading ? (
        <p className="panel p-6 font-mono text-sm text-ink-soft">Fetching the tag…</p>
      ) : isError || !item ? (
        <p className="panel p-6 text-bad">Unable to load this item.</p>
      ) : (
        // Same view-transition name as the tag on the list, so the tag grows into this card.
        <article className="tag-face rounded-b-3xl pb-8 sm:px-10" style={{ viewTransitionName: `item-${item.id}` } as CSSProperties}>
          <span className="tag-hole" aria-hidden="true" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="font-mono text-xs tracking-[0.18em] uppercase opacity-70">Item No. {item.id.slice(-6)}</p>
            <StatusStamp status={item.status} delay="0.5s" />
          </div>
          <h1 className="mt-3 font-display text-5xl leading-tight font-semibold">{item.name}</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed opacity-85">{item.description}</p>

          <dl className="mt-8 grid gap-4 border-t border-dashed border-tag-edge pt-6 font-mono text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs tracking-[0.16em] uppercase opacity-60">Category</dt>
              <dd className="mt-1">{item.category}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.16em] uppercase opacity-60">Found at</dt>
              <dd className="mt-1">{item.location}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.16em] uppercase opacity-60">Found on</dt>
              <dd className="mt-1">{new Date(item.foundAt).toLocaleDateString(undefined, { dateStyle: "long" })}</dd>
            </div>
          </dl>

          {item.status !== "Claimed" ? (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to={`/claims?itemId=${item.id}`} viewTransition className="btn-signal">
                This is mine, claim it
              </Link>
              {!token ? <p className="text-sm opacity-70">You will be asked to sign in first.</p> : null}
            </div>
          ) : (
            <p className="mt-8 font-mono text-sm opacity-70">This item has already gone home.</p>
          )}
        </article>
      )}
    </section>
  );
}
