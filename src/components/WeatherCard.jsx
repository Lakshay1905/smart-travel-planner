import React from 'react';
import { getWeatherEmoji } from '../services/weatherService';
import './WeatherCard.css';

/**
 * WeatherCard
 * -----------
 * Displays the current weather for the searched city:
 *   - Hero section: city name, icon, temperature, description
 *   - Stats grid: humidity, wind, rainfall, pressure, visibility, cloud cover
 *
 * Props:
 *   weather {object}  OWM /weather response
 *   unit    {string}  'metric' | 'imperial'
 */
function WeatherCard({ weather, unit }) {
  const tempUnit  = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  // Safely read optional rain field
  const rain1h = weather.rain?.['1h'] ?? 0;

  const stats = [
    {
      label: 'Humidity',
      value: `${weather.main.humidity}%`,
      note: weather.main.humidity > 75 ? 'High' : 'Comfortable',
    },
    {
      label: 'Wind Speed',
      value: `${Math.round(weather.wind.speed)} ${speedUnit}`,
      note: weather.wind.speed > 10 ? 'Strong' : 'Calm',
    },
    {
      label: 'Rainfall (1h)',
      value: `${rain1h.toFixed(1)} mm`,
      note: rain1h > 2 ? 'Heavy' : rain1h > 0 ? 'Light' : 'None',
    },
    {
      label: 'Pressure',
      value: `${weather.main.pressure}`,
      note: 'hPa',
    },
    {
      label: 'Visibility',
      value: weather.visibility != null
        ? `${(weather.visibility / 1000).toFixed(1)} km`
        : 'N/A',
      note: '',
    },
    {
      label: 'Cloud Cover',
      value: `${weather.clouds.all}%`,
      note: weather.clouds.all > 70 ? 'Overcast' : weather.clouds.all > 30 ? 'Partly cloudy' : 'Clear',
    },
  ];

  return (
    <div className="stp-card wc-card">
      {/* ── Hero ── */}
      <div className="wc-hero">
        <div className="wc-icon">{getWeatherEmoji(weather.weather[0].icon)}</div>
        <div className="wc-meta">
          <div className="wc-country">{weather.sys.country}</div>
          <div className="wc-city">{weather.name}</div>
          <div className="wc-desc">{weather.weather[0].description}</div>
        </div>
        <div className="wc-temp-block">
          <span className="wc-temp">{Math.round(weather.main.temp)}</span>
          <span className="wc-temp-unit">{tempUnit}</span>
          <div className="wc-feels">
            Feels like {Math.round(weather.main.feels_like)}{tempUnit}
          </div>
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="wc-stats">
        {stats.map((s) => (
          <div key={s.label} className="wc-stat">
            <div className="wc-stat-label">{s.label}</div>
            <div className="wc-stat-value">{s.value}</div>
            {s.note && <div className="wc-stat-note">{s.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherCard;
