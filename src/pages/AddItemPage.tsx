import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createItem, type ItemCategory, type ItemStatus } from "../api/client";

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

  const mutation = useMutation({
    mutationFn: (data: AddItemFormValues) => createItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      navigate("/items", { replace: true });
    },
  });

  const {
    register,
    handleSubmit,
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

  const onSubmit = (values: AddItemFormValues) => {
    mutation.mutate(values);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-100">Lost & Found</p>
        <h2 className="mt-3 text-4xl font-bold">Log a new item</h2>
        <p className="mt-3 max-w-2xl text-amber-50">
          Add a newly recovered item to the system. Fill in all required fields.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Item Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Black Water Bottle"
                {...register("name", { required: "Item name is required" })}
              />
              {errors.name ? <p className="text-sm text-rose-600">{errors.name.message}</p> : null}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                {...register("category", { required: "Category is required" })}
              >
                <option value="Personal">Personal</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Documents">Documents</option>
              </select>
              {errors.category ? <p className="text-sm text-rose-600">{errors.category.message}</p> : null}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <select
                id="status"
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                {...register("status", { required: "Status is required" })}
              >
                <option value="Recovered">Recovered</option>
                <option value="Awaiting Pickup">Awaiting Pickup</option>
                <option value="Claimed">Claimed</option>
              </select>
              {errors.status ? <p className="text-sm text-rose-600">{errors.status.message}</p> : null}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location Found *</Label>
              <Input
                id="location"
                placeholder="e.g., Main entrance desk"
                {...register("location", { required: "Location is required" })}
              />
              {errors.location ? <p className="text-sm text-rose-600">{errors.location.message}</p> : null}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              placeholder="Describe the item in detail (color, brand, condition, distinguishing features, etc.)"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              rows={4}
              {...register("description", { required: "Description is required" })}
            />
            {errors.description ? <p className="text-sm text-rose-600">{errors.description.message}</p> : null}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={mutation.isPending}>
              {mutation.isPending ? "Adding item..." : "✓ Add Item"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/items", { replace: true })}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
          </div>

          {mutation.isError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
              Failed to add item. Please try again.
            </div>
          ) : null}

          {mutation.isSuccess ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
              Item added successfully! Redirecting to items list...
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
