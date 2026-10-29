import type { CSSProperties } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createItem, getCategories, type ItemCategory, type ItemStatus } from "../api/client";
import StatusStamp from "../components/StatusStamp";

interface AddItemFormValues {
  name: string;
  category: ItemCategory;
  status: ItemStatus;
  location: string;
  description: string;
}

export default function AddItemPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // The dropdown options come from the backend's public categories endpoint.
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const mutation = useMutation({
    mutationFn: (data: AddItemFormValues) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      navigate("/items", { replace: true, viewTransition: true });
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddItemFormValues>({
    defaultValues: {
      name: "",
      category: "Personal",
      status: "Recovered",
      location: "",
      description: "",
    },
  });
  // Live values for the preview tag on the right.
  const preview = useWatch({ control });

  return (
    <section className="space-y-8">
      <header>
        <p className="eyebrow">Tag a found item</p>
        <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight">Write the tag</h1>
        <p className="mt-3 max-w-xl text-ink-soft">Fill in what you found. The tag on the right is exactly what everyone browsing the shelf will see.</p>
      </header>

      <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="panel space-y-5 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Item name *</span>
              <input className="field" placeholder="e.g. Black water bottle" {...register("name", { required: "Item name is required" })} />
              {errors.name ? <span className="block text-sm text-bad">{errors.name.message}</span> : null}
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Category *</span>
              <select className="field" disabled={!categoriesQuery.data} {...register("category", { required: "Category is required" })}>
                {categoriesQuery.isLoading ? <option value="">Loading categories…</option> : null}
                {categoriesQuery.data?.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categoriesQuery.isError ? <span className="block text-sm text-bad">Unable to load categories.</span> : null}
              {errors.category ? <span className="block text-sm text-bad">{errors.category.message}</span> : null}
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Status *</span>
              <select className="field" {...register("status", { required: "Status is required" })}>
                <option value="Recovered">Recovered</option>
                <option value="Awaiting Pickup">Awaiting Pickup</option>
                <option value="Claimed">Claimed</option>
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Where it was found *</span>
              <input className="field" placeholder="e.g. Main entrance desk" {...register("location", { required: "Location is required" })} />
              {errors.location ? <span className="block text-sm text-bad">{errors.location.message}</span> : null}
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-sm font-medium">Description *</span>
            <textarea
              className="field"
              rows={4}
              placeholder="Colour, brand, condition, anything that helps the owner recognise it"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description ? <span className="block text-sm text-bad">{errors.description.message}</span> : null}
          </label>

          {mutation.isError ? <p className="rounded-xl border border-bad/30 bg-bad/10 p-3 text-sm text-bad">{mutation.error.message}</p> : null}

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn-signal" disabled={mutation.isPending}>
              {mutation.isPending ? "Hanging it on the shelf…" : "Hang it on the shelf"}
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate("/items", { viewTransition: true })} disabled={mutation.isPending}>
              Cancel
            </button>
          </div>
        </form>

        <div className="pt-6 lg:sticky lg:top-28" aria-live="polite">
          <p className="mb-6 font-mono text-xs tracking-[0.18em] text-ink-soft uppercase">Preview</p>
          <div className="tag" style={{ "--tilt": "-2deg" } as CSSProperties}>
            <svg className="tag-string" viewBox="0 0 24 40" fill="none" aria-hidden="true">
              <path d="M12 0 C 4 12, 20 22, 12 38" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <div className="tag-face">
              <span className="tag-hole" aria-hidden="true" />
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[0.68rem] tracking-[0.16em] uppercase opacity-70">No. ······</p>
                {preview.status ? <StatusStamp status={preview.status} delay="0s" /> : null}
              </div>
              <h3 className="mt-2 font-display text-2xl leading-tight font-semibold">{preview.name || "Item name"}</h3>
              <p className="mt-2 line-clamp-3 text-sm opacity-80">{preview.description || "Description"}</p>
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-xs">
                <dt className="opacity-60">CAT</dt>
                <dd>{preview.category}</dd>
                <dt className="opacity-60">AT</dt>
                <dd className="truncate">{preview.location || "—"}</dd>
                <dt className="opacity-60">ON</dt>
                <dd>{new Date().toLocaleDateString()}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
