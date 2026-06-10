import { fetchWithRetry } from "./api";
import type {
  WeatherResponse,
  ParsedWeatherData,
  HourlyForecast,
  DailyForecast
} from "../types/weather";

const WEATHER_BASE_URL = import.meta.env.VITE_WEATHER_API_URL || "https://api.open-meteo.com/v1";

/**
 * Fetches the weather forecast for a given latitude and longitude coordinates.
 * Queries current weather, hourly metrics, and daily predictions.
 * 
 * @param latitude Geographical latitude coordinate
 * @param longitude Geographical longitude coordinate
 * @returns parsed, component-ready weather forecast data structure
 */
export async function getWeatherForecast(
  latitude: number,
  longitude: number,
  options?: { signal?: AbortSignal }
): Promise<ParsedWeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,pressure_msl,cloud_cover,wind_speed_10m,uv_index",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max",
    timezone: "auto"
  });

  const url = `${WEATHER_BASE_URL}/forecast?${params.toString()}`;

  try {
    const response = await fetchWithRetry<WeatherResponse>(url, options);
    return parseWeatherData(response);
  } catch (error) {
    console.error("[WeatherService] Failed to retrieve weather forecast:", error);
    throw error;
  }
}

/**
 * Response Mapper: Maps raw tabular lists from WeatherResponse into
 * structured model formats suitable for frontend components.
 */
function parseWeatherData(response: WeatherResponse): ParsedWeatherData {
  const { current, hourly, daily, latitude, longitude, timezone, elevation } = response;

  // 1. Current Weather Mapping
  const parsedCurrent = {
    time: current.time,
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    apparentTemperature: current.apparent_temperature,
    isDay: current.is_day === 1,
    precipitation: current.precipitation,
    weatherCode: current.weather_code,
    windSpeed: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    pressure: current.pressure_msl
  };

  // 2. Hourly Forecast Mapping (limit to 24 slots for daily timeline view)
  const parsedHourly: HourlyForecast[] = [];
  const hourlyCount = Math.min(hourly.time.length, 24);
  for (let i = 0; i < hourlyCount; i++) {
    parsedHourly.push({
      time: hourly.time[i],
      temperature: hourly.temperature_2m[i],
      precipitationProbability: hourly.precipitation_probability[i],
      weatherCode: hourly.weather_code[i],
      windSpeed: hourly.wind_speed_10m[i],
      uvIndex: hourly.uv_index[i]
    });
  }

  // 3. Daily Forecast Mapping (7 Days)
  const parsedDaily: DailyForecast[] = [];
  const dailyCount = daily.time.length;
  for (let i = 0; i < dailyCount; i++) {
    parsedDaily.push({
      date: daily.time[i],
      weatherCode: daily.weather_code[i],
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
      apparentTempMax: daily.apparent_temperature_max[i],
      apparentTempMin: daily.apparent_temperature_min[i],
      sunrise: daily.sunrise[i],
      sunset: daily.sunset[i],
      uvIndexMax: daily.uv_index_max[i],
      precipitationSum: daily.precipitation_sum[i],
      precipitationProbabilityMax: daily.precipitation_probability_max[i]
    });
  }

  return {
    latitude,
    longitude,
    timezone,
    elevation,
    current: parsedCurrent,
    hourly: parsedHourly,
    daily: parsedDaily
  };
}
