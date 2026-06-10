import { useState, useEffect, useCallback, useRef } from "react";
import type { ParsedWeatherData } from "../types/weather";
import { getWeatherForecast } from "../services/weatherService";

// Simple in-memory cache
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: ParsedWeatherData;
  timestamp: number;
}

const weatherCache = new Map<string, CacheEntry>();

export interface UseWeatherResult {
  data: ParsedWeatherData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWeather(latitude: number | null, longitude: number | null): UseWeatherResult {
  const [data, setData] = useState<ParsedWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWeather = useCallback(async (forceRefresh = false) => {
    if (latitude === null || longitude === null) {
      setData(null);
      setError(null);
      return;
    }

    const cacheKey = `${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
    
    if (!forceRefresh && weatherCache.has(cacheKey)) {
      const entry = weatherCache.get(cacheKey)!;
      if (Date.now() - entry.timestamp < CACHE_DURATION_MS) {
        setData(entry.data);
        setError(null);
        return;
      }
    }

    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const forecast = await getWeatherForecast(latitude, longitude, { signal: controller.signal });
      
      weatherCache.set(cacheKey, {
        data: forecast,
        timestamp: Date.now()
      });
      
      setData(forecast);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return; // Ignore manual abort errors
      }

      console.error("[useWeather] Error fetching weather data:", err);
      
      let message = "We're having trouble retrieving the weather forecast. Please try again later.";
      if (err instanceof Error) {
        if (err.name === "TimeoutError") {
          message = "The request timed out. Your connection might be slow, or our servers are busy. Please try again.";
        } else if (err.name === "NetworkError") {
          message = "You seem to be offline. Please check your internet connection and try again.";
        } else if (err.name === "APIError") {
          // You could inspect err.status if needed, but a friendly fallback is best
          message = "The weather service is currently unavailable. Please try again later.";
        }
      }
      
      setError(message);
    } finally {
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetchWeather();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWeather]);

  const refetch = useCallback(() => fetchWeather(true), [fetchWeather]);

  return {
    data,
    loading,
    error,
    refetch
  };
}
