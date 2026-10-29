import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { ItemRecord } from "../api/client";
import { hashString } from "../lib/motion";

const SWEEP_SECONDS = 4;

// Every real item becomes a blip. Its angle comes from its id, and its animation delay
// is that angle's share of one sweep, so each blip pings exactly when the beam passes it.
export default function Radar({ items }: { items: ItemRecord[] }) {
  return (
    <div className="radar" style={{ "--sweep": `${SWEEP_SECONDS}s` } as CSSProperties} role="img" aria-label={`Radar showing ${items.length} items on the desk`}>
      <div className="radar-sweep" />
      {items.map((item) => {
        const hash = hashString(item.id);
        const angle = hash % 360;
        const radius = 14 + ((hash >>> 9) % 30); // percent of the radar, kept off the centre and the rim
        const radians = (angle * Math.PI) / 180;
        const style = {
          left: `${50 + radius * Math.sin(radians)}%`,
          top: `${50 - radius * Math.cos(radians)}%`,
          "--delay": `${(angle / 360) * SWEEP_SECONDS}s`,
        } as CSSProperties;

        return (
          <Link key={item.id} to={`/items/${item.id}`} viewTransition className="radar-blip outline-none" style={style} aria-label={item.name}>
            <span className="radar-label">{item.name}</span>
          </Link>
        );
      })}
      <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_10px_rgb(0_0_0/0.25)]" />
    </div>
  );
}
