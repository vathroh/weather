import { useWeather } from "./useWeather";
import type { HourlyForecast, DailyForecast } from "../types/weather";

export interface UseForecastResult {
  hourly: HourlyForecast[] | undefined;
  daily: DailyForecast[] | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * A specialized hook for accessing just the forecast arrays (hourly/daily).
 * Under the hood, it leverages useWeather to share the same cache and fetching logic.
 */
export function useForecast(latitude: number | null, longitude: number | null): UseForecastResult {
  const { data, loading, error, refetch } = useWeather(latitude, longitude);

  return {
    hourly: data?.hourly,
    daily: data?.daily,
    loading,
    error,
    refetch
  };
}
