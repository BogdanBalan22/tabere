import { z } from "zod";
import { INSCRIPTION_AGE_CATEGORIES, INSCRIPTION_SERIES_OPTIONS } from "./inscription-constants";

export const inscriptionPayloadSchema = z.object({
  parentName: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(40),
  email: z.string().trim().email().max(254),
  childName: z.string().trim().min(2).max(120),
  age: z.coerce.number().int().min(5).max(11),
  school: z.string().trim().min(2).max(200),
  series: z.enum(INSCRIPTION_SERIES_OPTIONS),
  medicalInfo: z.string().trim().min(1).max(4000),
  gdpr: z.literal(true),
  ageCategory: z.enum(INSCRIPTION_AGE_CATEGORIES),
});

export type InscriptionPayload = z.infer<typeof inscriptionPayloadSchema>;
