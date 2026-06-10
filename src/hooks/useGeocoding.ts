import { useState, useEffect, useRef } from "react";
import type { GeocodingLocation } from "../types/weather";
import { searchCities } from "../services/geocodingService";

export interface UseGeocodingResult {
  results: GeocodingLocation[];
  loading: boolean;
  error: string | null;
  clearResults: () => void;
}

export function useGeocoding(query: string): UseGeocodingResult {
  const [results, setResults] = useState<GeocodingLocation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Keep track of the active request so we can abort it
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Clear results if query is empty
    if (!query || query.trim().length < 2) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    const performSearch = async () => {
      // Cancel previous request if still running
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const locations = await searchCities(query, 10, "en", { signal: controller.signal });
        setResults(locations);
      } catch (err: unknown) {
        // Ignore AbortError since it's expected during manual cancellation
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        
        console.error("[useGeocoding] Error searching cities:", err);
        
        let message = "We're having trouble finding locations. Please try again.";
        if (err instanceof Error) {
          if (err.name === "TimeoutError") {
            message = "The search timed out. Your connection might be slow.";
          } else if (err.name === "NetworkError") {
            message = "You seem to be offline. Please check your connection.";
          } else if (err.name === "APIError") {
            message = "The search service is currently unavailable.";
          }
        }
        
        setError(message);
      } finally {
        if (abortControllerRef.current === controller) {
          setLoading(false);
        }
      }
    };

    performSearch();

    return () => {
      // Cleanup on unmount or when query changes
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  const clearResults = () => {
    setResults([]);
    setError(null);
    setLoading(false);
  };

  return { results, loading, error, clearResults };
}
