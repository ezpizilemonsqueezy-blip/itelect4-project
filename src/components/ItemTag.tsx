import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { ItemRecord } from "../api/client";
import { tiltFor } from "../lib/motion";
import StatusStamp from "./StatusStamp";

interface ItemTagProps {
  item: ItemRecord;
  index: number;
}

// A recovered item drawn as a manila luggage tag. The outer <li> plays the drop-in
// animation and the inner link swings on hover, so the two never fight over transform.
export default function ItemTag({ item, index }: ItemTagProps) {
  return (
    <li className="tag-drop list-none pt-6" style={{ "--i": index } as CSSProperties}>
      <Link
        to={`/items/${item.id}`}
        viewTransition
        className="tag outline-none"
        style={{ "--tilt": tiltFor(item.id), viewTransitionName: `item-${item.id}` } as CSSProperties}
      >
        <svg className="tag-string" viewBox="0 0 24 40" fill="none" aria-hidden="true">
          <path d="M12 0 C 4 12, 20 22, 12 38" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <div className="tag-face">
          <span className="tag-hole" aria-hidden="true" />
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] opacity-70">No. {item.id.slice(-6)}</p>
          <h3 className="mt-2 font-display text-2xl leading-tight font-semibold">{item.name}</h3>
          {/* The stamp sits in the bottom-right corner, clear of the title however long it is. */}
          <div className="absolute right-4 bottom-5">
            <StatusStamp status={item.status} />
          </div>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 pr-24 font-mono text-xs">
            <dt className="opacity-60">CAT</dt>
            <dd>{item.category}</dd>
            <dt className="opacity-60">AT</dt>
            <dd className="truncate">{item.location}</dd>
            <dt className="opacity-60">ON</dt>
            <dd>{new Date(item.foundAt).toLocaleDateString()}</dd>
          </dl>
        </div>
      </Link>
    </li>
  );
}
