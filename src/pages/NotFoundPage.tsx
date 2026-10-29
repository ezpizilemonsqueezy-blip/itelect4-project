import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-md flex-col items-center py-10 text-center">
      {/* A tag gently swaying on its string: the page itself is the lost item. */}
      <div className="origin-top animate-[sway_3.2s_ease-in-out_infinite] will-change-transform">
        <div className="mx-auto h-16 w-px bg-tag-edge" />
        <div className="tag-face w-64 rounded-b-xl text-left shadow-[0_20px_30px_-18px_rgb(0_0_0/0.5)]">
          <span className="tag-hole" aria-hidden="true" />
          <p className="font-mono text-xs tracking-[0.18em] uppercase opacity-70">Lost item · 404</p>
          <p className="mt-2 font-display text-3xl font-semibold">This page</p>
          <p className="mt-1 font-mono text-xs opacity-70">Last seen: nowhere</p>
        </div>
      </div>
      <h1 className="mt-10 font-display text-4xl font-semibold">We could not find that page</h1>
      <p className="mt-3 text-ink-soft">Even the lost and found loses things sometimes.</p>
      <Link to="/" viewTransition className="btn-signal mt-6">
        Back to the desk
      </Link>
    </section>
  );
}
