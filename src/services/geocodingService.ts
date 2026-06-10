import { fetchWithRetry } from "./api";
import type { GeocodingResponse, GeocodingLocation } from "../types/weather";

const GEOCODING_BASE_URL = import.meta.env.VITE_GEOCODING_API_URL || "https://geocoding-api.open-meteo.com/v1";

/**
 * Searches locations/cities by name using the Open-Meteo Geocoding API.
 * Uses the configurable geocoding base URL and supports custom language/count query parameters.
 * 
 * @param query City or location name to search
 * @param count Number of results to return (default: 10)
 * @param language Language of search results (default: "en")
 * @returns List of matching GeocodingLocation objects
 */
export async function searchCities(
  query: string,
  count: number = 10,
  language: string = "en",
  options?: { signal?: AbortSignal }
): Promise<GeocodingLocation[]> {
  if (!query.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    name: query.trim(),
    count: count.toString(),
    language,
    format: "json"
  });

  const url = `${GEOCODING_BASE_URL}/search?${params.toString()}`;

  try {
    const response = await fetchWithRetry<GeocodingResponse>(url, options);
    return response.results || [];
  } catch (error) {
    console.error("[GeocodingService] Failed to search cities:", error);
    throw error;
  }
}
