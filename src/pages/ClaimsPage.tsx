import type { CSSProperties } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { claimSchema, type ClaimFormValues } from "@/schemas/claimSchema";
import { createClaim, getClaims, getItems, updateClaim, type ClaimRecord, type ClaimStatus } from "../api/client";
import StatusStamp from "../components/StatusStamp";
import { useCountUp } from "../lib/motion";
import { useAuthStore } from "../store/authStore";

// The JWT payload is { userId }. Reading it (not verifying it) is enough to decide
// which buttons to show; the backend still checks ownership on every PATCH.
function userIdFromToken(token: string | null): string | null {
  try {
    const payload = token?.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/");
    return payload ? (JSON.parse(atob(payload)) as { userId?: string }).userId ?? null : null;
  } catch {
    return null;
  }
}

function Counter({ label, value, tone }: { label: ClaimStatus; value: number; tone: string }) {
  const shown = useCountUp(value, 700);
  return (
    <div className="panel p-5">
      <p className={`font-mono text-xs tracking-[0.18em] uppercase ${tone}`}>{label}</p>
      <p className="mt-2 font-display text-5xl font-semibold tabular-nums">{shown}</p>
    </div>
  );
}

export default function ClaimsPage() {
  const queryClient = useQueryClient();
  const myUserId = userIdFromToken(useAuthStore((state) => state.token));

  const { data: claims = [], isLoading, isError } = useQuery<ClaimRecord[]>({
    queryKey: ["claims"],
    queryFn: getClaims,
  });

  // Items are public, so the form can offer a dropdown and the list can show names.
  const { data: items = [] } = useQuery({ queryKey: ["items"], queryFn: getItems });
  const itemName = (itemId: string) => items.find((item) => item.id === itemId)?.name ?? itemId;
  const ownsItem = (itemId: string) => items.some((item) => item.id === itemId && item.userId === myUserId);
  const [searchParams] = useSearchParams();
  const preselectedItemId = searchParams.get("itemId") ?? "";

  const mutation = useMutation({
    mutationFn: createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ claimId, status }: { claimId: string; status: "Approved" | "Rejected" }) => updateClaim(claimId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClaimFormValues>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      claimantName: "",
      email: "",
      itemId: preselectedItemId,
    },
  });

  const onSubmit = (values: ClaimFormValues) => {
    // The backend sets status to Pending, so only the claim details are sent.
    mutation.mutate(values);
    reset({ claimantName: "", email: "", itemId: "" });
  };

  const count = (status: ClaimStatus) => claims.filter((claim) => claim.status === status).length;

  return (
    <section className="space-y-8">
      <header>
        <p className="eyebrow">Claims desk</p>
        <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight">Is it yours?</h1>
        <p className="mt-3 max-w-xl text-ink-soft">File a claim for an item you lost. The person who tagged it reviews your claim and approves or rejects it.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Counter label="Pending" value={count("Pending")} tone="text-pending" />
        <Counter label="Approved" value={count("Approved")} tone="text-ok" />
        <Counter label="Rejected" value={count("Rejected")} tone="text-bad" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="panel grid gap-4 p-6 md:grid-cols-3" noValidate>
        <h2 className="font-display text-2xl font-semibold md:col-span-3">File a claim</h2>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">Your name</span>
          <input className="field" autoComplete="name" placeholder="Juan Dela Cruz" {...register("claimantName")} />
          {errors.claimantName ? <span className="block text-sm text-bad">{errors.claimantName.message}</span> : null}
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">Email</span>
          <input className="field" type="email" autoComplete="email" placeholder="you@school.edu" {...register("email")} />
          {errors.email ? <span className="block text-sm text-bad">{errors.email.message}</span> : null}
        </label>

        <label className="space-y-1.5">
          <span className="text-sm font-medium">Item</span>
          <select className="field" {...register("itemId")}>
            <option value="">Select an item…</option>
            {items
              .filter((item) => item.status !== "Claimed")
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.location})
                </option>
              ))}
          </select>
          {errors.itemId ? <span className="block text-sm text-bad">{errors.itemId.message}</span> : null}
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-3">
          {mutation.isError ? <p className="text-sm text-bad">{mutation.error.message}</p> : <span />}
          <button type="submit" className="btn-signal" disabled={mutation.isPending}>
            {mutation.isPending ? "Filing…" : "File claim"}
          </button>
        </div>
      </form>

      {isLoading ? (
        <p className="panel p-6 font-mono text-sm text-ink-soft">Opening the ledger…</p>
      ) : isError ? (
        <p className="panel p-6 text-bad">Unable to load claims.</p>
      ) : claims.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-line p-10 text-center text-ink-soft">No claims yet.</p>
      ) : (
        <ul className="space-y-3">
          {claims.map((claim, index) => (
            <li key={claim.id} className="panel rise flex flex-wrap items-center justify-between gap-4 p-5" style={{ "--i": index } as CSSProperties}>
              <div className="min-w-0">
                <p className="font-display text-xl font-semibold">{claim.claimantName}</p>
                <p className="text-sm text-ink-soft">{claim.email}</p>
                <p className="mt-1 font-mono text-xs tracking-wide text-ink-soft">
                  {itemName(claim.itemId)} · {new Date(claim.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {claim.status === "Pending" && ownsItem(claim.itemId) ? (
                  <>
                    <button
                      type="button"
                      onClick={() => updateMutation.mutate({ claimId: claim.id, status: "Approved" })}
                      disabled={updateMutation.isPending}
                      className="rounded-full bg-ok px-4 py-2 text-sm font-semibold text-paper transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => updateMutation.mutate({ claimId: claim.id, status: "Rejected" })}
                      disabled={updateMutation.isPending}
                      className="rounded-full border border-bad px-4 py-2 text-sm font-semibold text-bad transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </>
                ) : null}
                <StatusStamp status={claim.status} delay={`${0.2 + index * 0.07}s`} />
              </div>
            </li>
          ))}
        </ul>
      )}

      {updateMutation.isError ? <p className="text-sm text-bad">{updateMutation.error.message}</p> : null}
    </section>
  );
}
