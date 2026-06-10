import React from "react";
import { Calendar, Droplet } from "lucide-react";
import type { DailyForecast as DailyType } from "../types/weather";
import { getWeatherCondition } from "../utils/weatherCode";
import { formatDayName, formatTemp } from "../utils/formatters";
import styles from "./WeeklyForecast.module.css";

interface WeeklyForecastProps {
  daily: DailyType[];
}

const WeeklyForecast = React.memo(function WeeklyForecast({ daily }: WeeklyForecastProps): React.ReactElement {
  // Compute absolute extremes of the week to map relative ranges
  const weekMin = Math.min(...daily.map((d) => d.tempMin));
  const weekMax = Math.max(...daily.map((d) => d.tempMax));
  const totalRange = weekMax - weekMin;

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>
        <Calendar size={20} aria-hidden="true" />
        <span>7-Day Forecast</span>
      </h3>

      <div className={styles.forecastList}>
        {daily.map((day, index) => {
          const isToday = index === 0;
          const dayName = isToday ? "Today" : formatDayName(day.date);
          const condition = getWeatherCondition(day.weatherCode, true);
          const Icon = condition.icon;

          // Calculate relative style percentage bounds
          const leftOffset = totalRange > 0 ? ((day.tempMin - weekMin) / totalRange) * 100 : 0;
          const rightOffset = totalRange > 0 ? ((day.tempMax - weekMin) / totalRange) * 100 : 100;
          const barWidth = Math.max(rightOffset - leftOffset, 8); // Minimum 8% width for visibility

          return (
            <div key={day.date} className={styles.dayRow}>
              <span className={`${styles.dayText} ${isToday ? styles.dayTextToday : ""}`}>
                {dayName}
              </span>

              <span className={styles.iconWrapper} title={condition.label}>
                <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
              </span>

              <div className={styles.conditionWrapper}>
                <span className={styles.conditionLabel}>{condition.label}</span>
                {day.precipitationProbabilityMax > 0 && (
                  <span className={styles.precipBadge} title="Max precipitation probability">
                    <Droplet size={8} fill="currentColor" aria-hidden="true" />
                    <span className={styles.srOnly}>Rain: </span>
                    {day.precipitationProbabilityMax}%
                  </span>
                )}
              </div>

              <div className={styles.tempRangeWrapper}>
                <span className={`${styles.tempValue} ${styles.minTemp}`}>
                  <span className={styles.srOnly}>Low </span>
                  {formatTemp(day.tempMin)}
                </span>
                
                <div className={styles.barTrack} aria-hidden="true">
                  <div
                    className={styles.barFill}
                    style={{
                      left: `${leftOffset}%`,
                      width: `${barWidth}%`
                    }}
                  />
                </div>

                <span className={`${styles.tempValue} ${styles.maxTemp}`}>
                  <span className={styles.srOnly}>High </span>
                  {formatTemp(day.tempMax)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

export default WeeklyForecast;
