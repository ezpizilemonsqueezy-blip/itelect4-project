import type { CSSProperties } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { askAi } from "../api/client";

const promptSchema = z.object({ prompt: z.string().trim().min(20, "Write at least 20 characters.").max(2000, "Keep the description under 2000 characters.") });
type PromptForm = z.infer<typeof promptSchema>;

export default function AiReviewPage() {
  const mutation = useMutation({ mutationFn: ({ prompt }: PromptForm) => askAi(prompt) });
  const { register, handleSubmit, watch, formState: { errors } } = useForm<PromptForm>({ resolver: zodResolver(promptSchema), defaultValues: { prompt: "" } });
  const prompt = watch("prompt");
  const review = mutation.data;

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <header className="rise relative overflow-hidden rounded-3xl bg-ink p-8 text-paper">
        <p className="font-mono text-xs tracking-[0.2em] text-signal uppercase">Gemini project review</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Get feedback on your project</h1>
        <p className="mt-3 max-w-2xl opacity-75">Describe your Campus Recovery Desk project. The review checks your users, lost item workflow, claim verification, data handling, and implementation.</p>
      </header>

      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="panel rise space-y-4 p-6" style={{ "--i": 1 } as CSSProperties}>
        <label htmlFor="project-description" className="block font-semibold">Project description</label>
        <textarea id="project-description" {...register("prompt")} maxLength={2000} rows={7} placeholder="Explain who uses the app, how items and claims move through it, and how you built it…" className="field p-4" />
        {errors.prompt && <p className="text-sm text-bad">{errors.prompt.message}</p>}
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-ink-soft">
          <span>{prompt.trim().length} / 2000 characters (minimum 20)</span>
          <button type="submit" disabled={mutation.isPending || prompt.trim().length < 20} className="btn-signal font-sans text-sm">{mutation.isPending ? "Reviewing…" : "Review my project"}</button>
        </div>
        {mutation.isError && <p role="alert" className="rounded-xl border border-bad/30 bg-bad/10 p-4 text-sm text-bad">{mutation.error.message}</p>}
      </form>

      {review && <article aria-live="polite" className="panel rise space-y-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="eyebrow">Project review</p><h3 className="mt-1 font-display text-2xl font-semibold">{review.summary}</h3></div>
          <span className="stamp text-ok">{review.readiness.replace("-", " ")}</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div><h4 className="font-semibold">What is working</h4><ul className="mt-2 list-disc space-y-2 pl-5 text-ink-soft">{review.strengths.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></div>
          <div><h4 className="font-semibold">Suggested improvements</h4><ul className="mt-2 list-disc space-y-2 pl-5 text-ink-soft">{review.improvements.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul></div>
        </div>
      </article>}
      <p className="text-center text-xs text-ink-soft">AI feedback is a starting point. Verify suggestions and do not include personal or sensitive information.</p>
    </section>
  );
}
