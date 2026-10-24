import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { askAi } from "../api/client";
import { useAuthStore } from "../store/authStore";

const promptSchema = z.object({ prompt: z.string().trim().min(20, "Write at least 20 characters.").max(2000, "Keep the description under 2000 characters.") });
type PromptForm = z.infer<typeof promptSchema>;

export default function AiReviewPage() {
  const token = useAuthStore((state) => state.token);
  const mutation = useMutation({ mutationFn: ({ prompt }: PromptForm) => askAi(prompt, token!) });
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PromptForm>({ resolver: zodResolver(promptSchema), defaultValues: { prompt: "" } });
  const prompt = watch("prompt");
  const review = mutation.data;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-8 text-white shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Gemini project review</p>
        <h2 className="mt-2 text-3xl font-bold">Get feedback on your project</h2>
        <p className="mt-3 max-w-2xl text-indigo-100">Describe your Campus Recovery Desk project. The review checks your users, lost item workflow, claim verification, data handling, and implementation.</p>
      </header>

      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <label htmlFor="project-description" className="block font-semibold">Project description</label>
        <textarea id="project-description" {...register("prompt")} maxLength={2000} rows={7} placeholder="Explain who uses the app, how items and claims move through it, and how you built it…" className="w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 outline-none ring-indigo-500 placeholder:text-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
        {errors.prompt && <p className="text-sm text-rose-600">{errors.prompt.message}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span>{prompt.trim().length} / 2000 characters (minimum 20)</span>
          <button type="submit" disabled={mutation.isPending || prompt.trim().length < 20} className="rounded-full bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">{mutation.isPending ? "Reviewing…" : "Review my project"}</button>
        </div>
        {mutation.isError && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{mutation.error.message}</p>}
      </form>

      {review && <article aria-live="polite" className="space-y-5 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm dark:border-emerald-900 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="text-sm font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Project review</p><h3 className="mt-1 text-xl font-bold">{review.summary}</h3></div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold capitalize text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">{review.readiness.replace("-", " ")}</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div><h4 className="font-semibold text-slate-900 dark:text-slate-100">What is working</h4><ul className="mt-2 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">{review.strengths.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></div>
          <div><h4 className="font-semibold text-slate-900 dark:text-slate-100">Suggested improvements</h4><ul className="mt-2 list-disc space-y-2 pl-5 text-slate-600 dark:text-slate-300">{review.improvements.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></div>
        </div>
      </article>}
      <p className="text-center text-xs text-slate-500">AI feedback is a starting point. Verify suggestions and do not include personal or sensitive information.</p>
    </section>
  );
}
