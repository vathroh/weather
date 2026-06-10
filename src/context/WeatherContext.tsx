import React, { createContext, useContext, useState, useEffect } from "react";
import type { GeocodingLocation, ParsedWeatherData } from "../types/weather";
import { useWeather } from "../hooks/useWeather";

export interface WeatherContextType {
  selectedCity: GeocodingLocation;
  weatherData: ParsedWeatherData | null;
  loading: boolean;
  error: string | null;
  selectCity: (city: GeocodingLocation) => void;
  refreshWeather: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

const DEFAULT_CITY: GeocodingLocation = {
  id: 1643084,
  name: "Jakarta",
  latitude: -6.2146,
  longitude: 106.8451,
  country_code: "ID",
  country: "Indonesia",
  admin1: "Jakarta"
};

export function WeatherProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [selectedCity, setSelectedCity] = useState<GeocodingLocation>(() => {
    const saved = localStorage.getItem("last-selected-city");
    if (saved) {
      try {
        return JSON.parse(saved) as GeocodingLocation;
      } catch {
        // Fallback
      }
    }
    return DEFAULT_CITY;
  });

  // Use custom hook for weather data fetching, caching, and abort handling
  const { data: weatherData, loading, error, refetch: refreshWeather } = useWeather(
    selectedCity.latitude,
    selectedCity.longitude
  );

  useEffect(() => {
    localStorage.setItem("last-selected-city", JSON.stringify(selectedCity));
  }, [selectedCity]);

  const selectCity = (city: GeocodingLocation) => {
    setSelectedCity(city);
  };

  const value: WeatherContextType = {
    selectedCity,
    weatherData,
    loading,
    error,
    selectCity,
    refreshWeather
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext(): WeatherContextType {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherProvider");
  }
  return context;
}
