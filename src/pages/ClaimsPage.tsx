import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { claimSchema, type ClaimFormValues } from "@/schemas/claimSchema";
import { createClaim, getClaims, updateClaim, type ClaimRecord } from "../api/client";
import { useAuthStore } from "../store/authStore";

export default function ClaimsPage() {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const { data: claims = [], isLoading, isError } = useQuery<ClaimRecord[]>({
    queryKey: ["claims"],
    queryFn: getClaims,
  });

  const mutation = useMutation({
    mutationFn: createClaim,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claims"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ claimId, status }: { claimId: string; status: "Approved" | "Rejected" }) =>
      updateClaim(claimId, status),
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
      itemId: "item-101",
    },
  });

  const onSubmit = (values: ClaimFormValues) => {
    mutation.mutate({
      itemId: values.itemId,
      claimantName: values.claimantName,
      email: values.email,
      status: "Pending",
    });

    reset({
      claimantName: "",
      email: "",
      itemId: "item-101",
    });
  };

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">Claims</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Verification queue</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{claims.filter((claim) => claim.status === "Pending").length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{claims.filter((claim) => claim.status === "Approved").length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Rejected</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{claims.filter((claim) => claim.status === "Rejected").length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">Submit a claim</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="claimantName">Claimant name</Label>
            <Input id="claimantName" placeholder="Claimant name" {...register("claimantName")} />
            {errors.claimantName ? <p className="text-sm text-rose-600">{errors.claimantName.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Email" {...register("email")} />
            {errors.email ? <p className="text-sm text-rose-600">{errors.email.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemId">Item id</Label>
            <Input id="itemId" placeholder="Item id" {...register("itemId")} />
            {errors.itemId ? <p className="text-sm text-rose-600">{errors.itemId.message}</p> : null}
          </div>

          <div className="md:col-span-3 flex justify-end">
            <Button type="submit" variant="default" disabled={mutation.isPending}>
              {mutation.isPending ? "Submitting..." : "Submit claim"}
            </Button>
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">Loading claims…</div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">Unable to load claims.</div>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
            <div key={claim.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{claim.claimantName}</p>
                  <p className="mt-1 text-sm text-slate-600">{claim.email}</p>
                  <p className="mt-1 text-xs text-slate-500">Item: {claim.itemId}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                  {claim.status}
                </span>
              </div>

              {claim.status === "Pending" && token && (
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => updateMutation.mutate({ claimId: claim.id, status: "Approved" })}
                    disabled={updateMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    ✓ Approve
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => updateMutation.mutate({ claimId: claim.id, status: "Rejected" })}
                    disabled={updateMutation.isPending}
                    className="bg-rose-600 hover:bg-rose-700"
                  >
                    ✗ Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
