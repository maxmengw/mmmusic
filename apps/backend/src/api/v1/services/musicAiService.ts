import { MUSIC_MAP_COUNTRIES } from '../../../../../../shared/data/musicMapCountries';

// Lightweight prototype AI service that returns a generated-style description.
// This is a placeholder implementation; later this should call a real LLM
// and persist the generated description if desired.

export async function generatePlaceholderDescription(countryKeyOrName: string): Promise<string> {
  const key = String(countryKeyOrName || '').toLowerCase().trim();

  const country = MUSIC_MAP_COUNTRIES.find((c: any) => c.code === key || c.name.toLowerCase() === key);

  const base = country?.description || `Music from ${countryKeyOrName}.`;

  // Create a short, friendly expanded description as a prototype.
  const generated = `${base} This description is a prototype AI-generated summary: it highlights key genres, notable styles, and example tracks. It can be replaced later by a true AI-generated description when integration is enabled.`;

  return generated;
}
