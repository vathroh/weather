import React from "react";
import type { CurrentWeather, GeocodingLocation } from "../types/weather";
import { getWeatherCondition } from "../utils/weatherCode";
import { formatShortDate, formatTemp, formatWindSpeed, formatHumidity } from "../utils/formatters";
import styles from "./CurrentWeatherCard.module.css";

interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  location: GeocodingLocation;
}

const CurrentWeatherCard = React.memo(function CurrentWeatherCard({
  weather,
  location
}: CurrentWeatherCardProps): React.ReactElement {
  const dateStr = formatShortDate(weather.time);
  const condition = getWeatherCondition(weather.weatherCode, weather.isDay);
  const IconComponent = condition.icon;

  const apparentTempDisplay = formatTemp(weather.apparentTemperature);
  const windDisplay = formatWindSpeed(weather.windSpeed);
  const humidityDisplay = formatHumidity(weather.humidity);

  return (
    <section className={styles.heroCard}>
      <div className={styles.glowOverlay} />
      
      <div className={styles.cardHeader}>
        <span className={styles.categoryTag}>ATMOSPHERE REPORT</span>
        <span className={styles.dateTime}>{dateStr}</span>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.locationWrapper}>
          <h2 className={styles.cityName}>{location.name}</h2>
          <span className={styles.adminName}>
            {[location.admin1, location.country].filter(Boolean).join(", ")}
          </span>
          <div className={styles.tempRow}>
            <span className={styles.temperature}>{Math.round(weather.temperature)}</span>
            <span className={styles.degreeSymbol}>°</span>
          </div>
        </div>

        <div className={styles.weatherIconWrapper}>
          <div className={styles.iconCircle} aria-hidden="true">
            <IconComponent size={48} strokeWidth={1.5} />
          </div>
          <p className={styles.conditionLabel}>{condition.label}</p>
        </div>
      </div>

      <div className={styles.quickStatsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>FEELS LIKE</span>
          <span className={styles.statValue}>{apparentTempDisplay}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>HUMIDITY</span>
          <span className={styles.statValue}>{humidityDisplay}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>WIND</span>
          <span className={styles.statValue}>{windDisplay}</span>
        </div>
      </div>
    </section>
  );
});

export default CurrentWeatherCard;
