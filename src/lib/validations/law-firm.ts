import { z } from "zod";

export const lawFirmSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  website: z.string().url("Must be a valid URL").max(2048, "URL is too long"),
  active: z.boolean().default(true),
  metadata: z.record(z.unknown()).optional().default({}),
  lastScrapedAt: z.date().nullable().optional(),
  scrapeStatus: z.string().nullable().optional(),
});

export type LawFirmFormData = z.infer<typeof lawFirmSchema>;

export const lawFirmUpdateSchema = lawFirmSchema.partial();

export type LawFirmUpdateData = z.infer<typeof lawFirmUpdateSchema>;
