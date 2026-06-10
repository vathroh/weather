/**
 * Formats a Date object or ISO string to a human-readable day format (e.g. "Monday")
 */
export const formatDayName = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

/**
 * Formats a Date object or ISO string to a short day and date (e.g. "Mon, May 29")
 */
export const formatShortDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

/**
 * Formats a Date object or ISO string to time format (e.g. "14:00")
 */
export const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
};

/**
 * Formats a temperature value (e.g., 23.4 -> "23°")
 */
export const formatTemp = (temp: number): string => {
  return `${Math.round(temp)}°`;
};

/**
 * Converts a wind direction in degrees to a compass sector representation (e.g., 90 -> "E")
 */
export const getWindDirectionName = (degree: number): string => {
  const sectors = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(((degree % 360) / 22.5)) % 16;
  return sectors[index];
};

/**
 * Formats speed to a standardized display value in km/h
 */
export const formatWindSpeed = (speed: number): string => {
  return `${Math.round(speed)} km/h`;
};

/**
 * Formats relative humidity to percentage string
 */
export const formatHumidity = (humidity: number): string => {
  return `${Math.round(humidity)}%`;
};

/**
 * Formats atmospheric pressure to hPa string
 */
export const formatPressure = (pressure: number): string => {
  return `${Math.round(pressure)} hPa`;
};

/**
 * Formats precipitation amount in mm
 */
export const formatPrecipitation = (mm: number): string => {
  return `${mm.toFixed(1)} mm`;
};
