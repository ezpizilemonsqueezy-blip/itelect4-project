import type { CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getItems } from "../api/client";
import ItemTag from "../components/ItemTag";
import Radar from "../components/Radar";
import { useCountUp } from "../lib/motion";
import { useAuthStore } from "../store/authStore";

function Stat({ label, value, note, index }: { label: string; value: number; note: string; index: number }) {
  const shown = useCountUp(value);
  return (
    <div className="panel rise p-5" style={{ "--i": index + 3 } as CSSProperties}>
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-display text-5xl font-semibold tabular-nums">{shown}</p>
      <p className="mt-1 text-sm text-ink-soft">{note}</p>
    </div>
  );
}

export default function HomePage() {
  const token = useAuthStore((state) => state.token);
  const { data: items = [], isLoading } = useQuery({ queryKey: ["items"], queryFn: getItems });

  const waiting = items.filter((item) => item.status !== "Claimed").length;
  const reunited = items.length - waiting;

  return (
    <div className="space-y-14">
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="eyebrow rise">Lost property office · open now</p>
          <h1 className="rise mt-4 font-display text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl" style={{ "--i": 1 } as CSSProperties}>
            Everything lost is <em className="text-signal">somewhere.</em>
          </h1>
          <p className="rise mt-5 max-w-lg text-lg text-ink-soft" style={{ "--i": 2 } as CSSProperties}>
            Every item handed in to the desk shows up on the scanner. Browse freely. You only need an account when one of them is yours.
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ "--i": 3 } as CSSProperties}>
            <Link to="/items" viewTransition className="btn-signal">
              Browse the desk <ArrowRight className="size-4" />
            </Link>
            <Link to={token ? "/items/add" : "/register"} viewTransition className="btn-ghost">
              {token ? "Tag a found item" : "Create an account"}
            </Link>
          </div>
        </div>

        <div className="rise flex flex-col items-center gap-3" style={{ "--i": 2 } as CSSProperties}>
          <Radar items={items} />
          <p className="font-mono text-xs tracking-[0.16em] text-ink-soft uppercase">
            {isLoading ? "Scanning…" : `${items.length} item${items.length === 1 ? "" : "s"} on the scanner · hover a blip`}
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Stat index={0} label="On the desk" value={items.length} note="Items handed in" />
        <Stat index={1} label="Waiting" value={waiting} note="Still looking for their owner" />
        <Stat index={2} label="Reunited" value={reunited} note="Claimed and collected" />
      </section>

      {items.length > 0 ? (
        <section>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold">Latest arrivals</h2>
            <Link to="/items" viewTransition className="font-mono text-xs tracking-[0.16em] text-signal uppercase hover:underline">
              See all →
            </Link>
          </div>
          <ul className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.slice(0, 3).map((item, index) => (
              <ItemTag key={item.id} item={item} index={index} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
