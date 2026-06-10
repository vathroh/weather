import React from "react";
import styles from "./WeatherDetailCard.module.css";

interface WeatherDetailCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  desc?: string;
}

const WeatherDetailCard = React.memo(function WeatherDetailCard({
  icon,
  title,
  value,
  desc
}: WeatherDetailCardProps): React.ReactElement {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className={styles.iconWrapper} aria-hidden="true">
          {icon}
        </span>
        <h4 className={styles.title}>{title}</h4>
      </div>
      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        {desc && <p className={styles.desc}>{desc}</p>}
      </div>
    </article>
  );
});

export default WeatherDetailCard;
