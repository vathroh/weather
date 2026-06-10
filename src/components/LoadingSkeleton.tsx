import React from "react";
import styles from "./LoadingSkeleton.module.css";

export function HeroSkeleton(): React.ReactElement {
  return (
    <div className={styles.skeletonHero} aria-busy="true" aria-label="Loading current weather">
      <div className={styles.flexBetween}>
        <div className={`${styles.shimmer} ${styles.box120x18}`} />
        <div className={`${styles.shimmer} ${styles.box80x18}`} />
      </div>
      <div className={styles.heroCenterContent}>
        <div className={styles.heroMainLines}>
          <div className={`${styles.shimmer} ${styles.box180x32} ${styles.mb8}`} />
          <div className={`${styles.shimmer} ${styles.box120x16} ${styles.mb16}`} />
          <div className={`${styles.shimmer} ${styles.box100x60}`} />
        </div>
        <div className={`${styles.shimmer} ${styles.circle90}`} />
      </div>
      <div className={styles.flexBetween}>
        <div className={`${styles.shimmer} ${styles.box80x36}`} />
        <div className={`${styles.shimmer} ${styles.box80x36}`} />
        <div className={`${styles.shimmer} ${styles.box80x36}`} />
      </div>
    </div>
  );
}

export function HoursSkeleton(): React.ReactElement {
  return (
    <div className={styles.skeletonHours} aria-busy="true" aria-label="Loading hourly forecast">
      <div className={`${styles.shimmer} ${styles.box150x20} ${styles.mb20}`} />
      <div className={styles.hoursList}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`${styles.shimmer} ${styles.hourItem}`}
          />
        ))}
      </div>
    </div>
  );
}

export function DetailsGridSkeleton(): React.ReactElement {
  return (
    <div className={styles.skeletonDetailsGrid} aria-busy="true" aria-label="Loading weather details">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={styles.skeletonDetailCard}>
          <div className={styles.detailHeader}>
            <div className={`${styles.shimmer} ${styles.circle20}`} />
            <div className={`${styles.shimmer} ${styles.box80x12}`} />
          </div>
          <div className={`${styles.shimmer} ${styles.box100x32} ${styles.mt12}`} />
          <div className={`${styles.shimmer} ${styles.box120x12} ${styles.mt12}`} />
        </div>
      ))}
    </div>
  );
}

export function WeekSkeleton(): React.ReactElement {
  return (
    <div className={styles.skeletonWeek} aria-busy="true" aria-label="Loading weekly forecast">
      <div className={`${styles.shimmer} ${styles.box150x20} ${styles.mb24}`} />
      <div className={styles.weekList}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={styles.flexBetweenAlign}>
            <div className={`${styles.shimmer} ${styles.box80x16}`} />
            <div className={`${styles.shimmer} ${styles.circle24}`} />
            <div className={`${styles.shimmer} ${styles.box60x16}`} />
            <div className={`${styles.shimmer} ${styles.box80x16}`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LoadingSkeleton(): React.ReactElement {
  // Composed skeleton maintaining original layout to avoid global refactoring
  return (
    <div className={styles.container} role="status" aria-label="Loading weather data">
      <div className={styles.leftCol}>
        <HeroSkeleton />
        <HoursSkeleton />
        <DetailsGridSkeleton />
      </div>

      <div className={styles.rightCol}>
        <WeekSkeleton />
      </div>
    </div>
  );
}
