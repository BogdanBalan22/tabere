export const INSCRIPTION_SERIES_OPTIONS = [
  "Săptămâna 1 - 22-26 iunie",
  "Săptămâna 2 - 29 iunie - 3 iulie",
  "Săptămâna 3 - 6-10 iulie",
  "Săptămâna 4 - 13-17 iulie",
] as const;

export type InscriptionSeries = (typeof INSCRIPTION_SERIES_OPTIONS)[number];

export const INSCRIPTION_AGE_CATEGORIES = ["5-7 ani", "7-9 ani", "9-11 ani"] as const;

export type InscriptionAgeCategory = (typeof INSCRIPTION_AGE_CATEGORIES)[number];
