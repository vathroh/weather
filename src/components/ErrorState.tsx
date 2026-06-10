import React from "react";
import { AlertTriangle } from "lucide-react";
import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({
  message = "We encountered a problem retrieving the weather forecast. Please check your internet connection or try again.",
  onRetry
}: ErrorStateProps): React.ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.errorCard} role="alert">
        <div className={styles.iconWrapper} aria-hidden="true">
          <AlertTriangle size={32} />
        </div>
        <h3 className={styles.title}>Unable to Load Data</h3>
        <p className={styles.message}>{message}</p>
        <button onClick={onRetry} className={styles.retryBtn} type="button">
          Try Again
        </button>
      </div>
    </div>
  );
}
