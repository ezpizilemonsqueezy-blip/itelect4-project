import type { ReactNode } from "react";

// A "visitor pass" card with a perforated tear-off strip, used by the auth pages.
export default function PassCard({ eyebrow, title, subtitle, children, footer }: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section className="rise mx-auto grid max-w-3xl overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_30px_60px_-35px_rgb(0_0_0/0.45)] md:grid-cols-[0.8fr_1.2fr]">
      <div className="relative flex flex-col justify-between gap-8 bg-ink p-8 text-paper">
        <div>
          <p className="font-mono text-[0.68rem] tracking-[0.2em] text-signal uppercase">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight font-semibold">{title}</h1>
          <p className="mt-3 text-sm opacity-75">{subtitle}</p>
        </div>
        <svg viewBox="0 0 120 40" className="h-10 w-32 opacity-60" aria-hidden="true">
          {Array.from({ length: 22 }, (_, index) => (
            <rect key={index} x={index * 5.4} y="0" width={index % 3 === 0 ? 3 : 1.5} height="40" fill="currentColor" />
          ))}
        </svg>
        {/* perforation between the stub and the pass */}
        <span
          aria-hidden="true"
          className="absolute top-0 -right-1.5 bottom-0 hidden w-3 md:block"
          style={{ background: "radial-gradient(circle, var(--surface) 0.32rem, transparent 0.36rem) 0 0 / 0.75rem 1.1rem repeat-y" }}
        />
      </div>
      <div className="p-8">
        {children}
        <div className="mt-6 text-center text-sm text-ink-soft">{footer}</div>
      </div>
    </section>
  );
}
