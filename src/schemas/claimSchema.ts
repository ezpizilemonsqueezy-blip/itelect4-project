import { z } from "zod";

export const claimSchema = z
  .object({
    claimantName: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name must be under 80 characters"),
    email: z.string().trim().email("Enter a valid email address"),
    itemId: z.string().trim().min(1, "Select an item first"),
  })
  .refine((data) => !data.email.endsWith("@example.com"), {
    message: "Please use your real email address",
    path: ["email"],
  });

export type ClaimFormValues = z.infer<typeof claimSchema>;
