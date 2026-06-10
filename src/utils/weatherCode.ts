import React from "react";
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  HelpCircle
} from "lucide-react";
import type { LucideProps } from "lucide-react";

export interface WeatherCondition {
  label: string;
  icon: React.ComponentType<LucideProps>;
  backgroundClass: string; // Used for UI gradient backgrounds
}

export const getWeatherCondition = (code: number, isDay: boolean = true): WeatherCondition => {
  switch (code) {
    case 0:
      return {
        label: "Clear Sky",
        icon: isDay ? Sun : Moon,
        backgroundClass: isDay ? "bg-clear-day" : "bg-clear-night",
      };
    case 1:
    case 2:
      return {
        label: isDay ? "Mainly Clear" : "Partly Cloudy",
        icon: isDay ? CloudSun : CloudMoon,
        backgroundClass: isDay ? "bg-cloudy-day" : "bg-cloudy-night",
      };
    case 3:
      return {
        label: "Overcast",
        icon: Cloud,
        backgroundClass: "bg-overcast",
      };
    case 45:
    case 48:
      return {
        label: "Foggy",
        icon: CloudFog,
        backgroundClass: "bg-foggy",
      };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return {
        label: "Drizzle",
        icon: CloudDrizzle,
        backgroundClass: "bg-drizzle",
      };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return {
        label: "Rainy",
        icon: CloudRain,
        backgroundClass: "bg-rainy",
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: "Snowy",
        icon: CloudSnow,
        backgroundClass: "bg-snowy",
      };
    case 80:
    case 81:
    case 82:
      return {
        label: "Rain Showers",
        icon: CloudRain,
        backgroundClass: "bg-rainy",
      };
    case 85:
    case 86:
      return {
        label: "Snow Showers",
        icon: CloudSnow,
        backgroundClass: "bg-snowy",
      };
    case 95:
    case 96:
    case 99:
      return {
        label: "Thunderstorm",
        icon: CloudLightning,
        backgroundClass: "bg-thunderstorm",
      };
    default:
      return {
        label: "Unknown Condition",
        icon: HelpCircle,
        backgroundClass: "bg-unknown",
      };
  }
};
