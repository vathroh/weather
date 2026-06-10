import React from "react";
import {
  Sun,
  Moon,
  Wind,
  Droplets,
  Gauge,
  Sunset,
  Umbrella,
  CloudLightning,
} from "lucide-react";
import SearchBar from "../components/SearchBar";
import CurrentWeatherCard from "../components/CurrentWeatherCard";
import HourlyForecast from "../components/HourlyForecast";
import WeeklyForecast from "../components/WeeklyForecast";
import WeatherDetailCard from "../components/WeatherDetailCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ErrorState from "../components/ErrorState";
import { useWeatherContext } from "../context/WeatherContext";
import { useTheme } from "../hooks/useTheme";
import {
  getWindDirectionName,
  formatTime,
  formatHumidity,
  formatWindSpeed,
  formatPressure,
  formatPrecipitation,
} from "../utils/formatters";
import styles from "./WeatherDashboard.module.css";

const getUVRating = (uv: number): string => {
  if (uv <= 2) return "Low exposure risk";
  if (uv <= 5) return "Moderate exposure risk";
  if (uv <= 7) return "High risk (wear sunscreen)";
  if (uv <= 10) return "Very High exposure risk";
  return "Extreme risk (avoid outdoors)";
};

export default function WeatherDashboard(): React.ReactElement {
  const { theme, toggleTheme } = useTheme();

  // Consume centralized weather states from WeatherContext
  const {
    selectedCity,
    weatherData: data,
    loading,
    error,
    refreshWeather: refetch,
  } = useWeatherContext();

  const todayDaily = data?.daily?.[0];

  return (
    <div className={styles.pageWrapper}>
      {/* Upper Navigation / Brand bar */}
      <header className={styles.header}>
        <div className={styles.brandWrapper}>
          <h1 className={styles.logoText}>
            Check The Weather<span className={styles.logoAccent}>.</span>
          </h1>
          <span className={styles.logoSub}>Biomarker & Climate Tech</span>
        </div>

        <div className={styles.actions}>
          <SearchBar />

          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            type="button"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main page state management router */}
      {loading && <LoadingSkeleton />}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && !data && (
        <div className={styles.emptyState}>
          <CloudLightning size={48} className={styles.logoAccent} />
          <h3 className={styles.emptyTitle}>No Location Selected</h3>
          <p className={styles.emptyDesc}>
            Type a city name in the search bar above to load real-time
            meteorological reports.
          </p>
        </div>
      )}

      {!loading && !error && data && selectedCity && (
        <div className={`${styles.dashboardLayout} animate-fade-in`}>
          {/* Left Column - Core Metrics & Bento Cards */}
          <div className={styles.leftCol}>
            <CurrentWeatherCard
              weather={data.current}
              location={selectedCity}
            />

            <HourlyForecast hourly={data.hourly} />

            <div className={styles.statsGrid}>
              <WeatherDetailCard
                icon={<Sun size={18} />}
                title="UV Index"
                value={Math.round(todayDaily?.uvIndexMax ?? 0)}
                desc={getUVRating(todayDaily?.uvIndexMax ?? 0)}
              />

              <WeatherDetailCard
                icon={<Wind size={18} />}
                title="Wind"
                value={formatWindSpeed(data.current.windSpeed)}
                desc={`Blows ${getWindDirectionName(data.current.windDirection)} (${data.current.windDirection}°)`}
              />

              <WeatherDetailCard
                icon={<Sunset size={18} />}
                title="Sunrise & Sunset"
                value={todayDaily ? formatTime(todayDaily.sunset) : "--:--"}
                desc={
                  todayDaily ? `Sunrise: ${formatTime(todayDaily.sunrise)}` : ""
                }
              />

              <WeatherDetailCard
                icon={<Droplets size={18} />}
                title="Humidity"
                value={formatHumidity(data.current.humidity)}
                desc={`The apparent temperature feels like ${Math.round(data.current.apparentTemperature)}°`}
              />

              <WeatherDetailCard
                icon={<Gauge size={18} />}
                title="Pressure"
                value={formatPressure(data.current.pressure)}
                desc="Standard sea-level atmospheric force"
              />

              <WeatherDetailCard
                icon={<Umbrella size={18} />}
                title="Precipitation"
                value={formatPrecipitation(data.current.precipitation)}
                desc={
                  todayDaily
                    ? `Max Rain Chance: ${todayDaily.precipitationProbabilityMax}%`
                    : ""
                }
              />
            </div>
          </div>

          {/* Right Column - 7-Day Forecast */}
          <div className={styles.rightCol}>
            <WeeklyForecast daily={data.daily} />
          </div>
        </div>
      )}
    </div>
  );
}
