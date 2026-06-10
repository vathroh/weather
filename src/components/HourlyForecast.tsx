import React from "react";
import { Clock, Droplet } from "lucide-react";
import type { HourlyForecast as HourlyType } from "../types/weather";
import { getWeatherCondition } from "../utils/weatherCode";
import { formatTime, formatTemp } from "../utils/formatters";
import styles from "./HourlyForecast.module.css";

interface HourlyForecastProps {
  hourly: HourlyType[];
}

const HourlyForecast = React.memo(function HourlyForecast({ hourly }: HourlyForecastProps): React.ReactElement {
  // Get current hour string to highlight it in the timeline
  const currentHourString = new Date().getHours().toString().padStart(2, "0") + ":00";

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>
        <Clock size={20} aria-hidden="true" />
        <span>Hourly Forecast</span>
      </h3>

      <div className={styles.scrollWrapper} tabIndex={0} aria-label="Hourly timeline">
        {hourly.map((item, index) => {
          const formattedHour = formatTime(item.time);
          const isActive = formattedHour === currentHourString;
          const condition = getWeatherCondition(item.weatherCode, true); // Assume day for hourly icons
          const Icon = condition.icon;

          return (
            <div
              key={index}
              className={`${styles.hourCard} ${isActive ? styles.hourCardActive : ""}`}
              role="group"
              aria-label={`Forecast at ${formattedHour}`}
              tabIndex={0}
            >
              <span className={styles.timeText}>{formattedHour}</span>
              
              <span className={styles.iconWrapper} aria-hidden="true">
                <Icon size={28} strokeWidth={1.5} />
              </span>

              <span className={styles.tempText}>{formatTemp(item.temperature)}</span>

              {item.precipitationProbability > 0 && (
                <div className={styles.precipWrapper} title="Rain probability">
                  <Droplet size={10} fill="currentColor" aria-hidden="true" />
                  <span className={styles.srOnly}>Rain: </span>
                  <span>{item.precipitationProbability}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
});

export default HourlyForecast;
