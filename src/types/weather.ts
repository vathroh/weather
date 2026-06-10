export interface GeocodingLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code: string;
  admin1_id?: number;
  admin2_id?: number;
  country_id?: number;
  country: string;
  admin1?: string;
  admin2?: string;
}

export interface GeocodingResponse {
  results?: GeocodingLocation[];
  generationtime_ms: number;
}

export interface CurrentWeatherResponse {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

export interface HourlyForecastResponse {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  pressure_msl: number[];
  cloud_cover: number[];
  wind_speed_10m: number[];
  uv_index: number[];
}

export interface DailyForecastResponse {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
}

export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    [key: string]: string;
  };
  current: CurrentWeatherResponse;
  hourly_units: {
    [key: string]: string;
  };
  hourly: HourlyForecastResponse;
  daily_units: {
    [key: string]: string;
  };
  daily: DailyForecastResponse;
}

// Custom UI types mapped from the raw responses to simplify component consumption
export interface CurrentWeather {
  time: string;
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  precipitationProbability: number;
  weatherCode: number;
  windSpeed: number;
  uvIndex: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
}

export interface ParsedWeatherData {
  latitude: number;
  longitude: number;
  timezone: string;
  elevation: number;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}
