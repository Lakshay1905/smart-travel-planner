import React from 'react';
import { getWeatherEmoji } from '../services/weatherService';
import './Forecast.css';

/**
 * Forecast
 * --------
 * Renders a 5-day weather forecast grid.
 * The best travel day is visually highlighted.
 *
 * Props:
 *   forecasts {object}  OWM /forecast response (contains `list` array)
 *   bestDate  {string}  "YYYY-MM-DD" of the best travel day
 *   unit      {string}  'metric' | 'imperial'
 */
function Forecast({ forecasts, bestDate, unit }) {
  const tempUnit = unit === 'metric' ? '°C' : '°F';

  /**
   * Pick one representative slot per calendar date.
   * We prefer the slot closest to midday (12:00 UTC).
   */
  const dayMap = {};

  forecasts.list.forEach((slot) => {
    const date = slot.dt_txt.split(' ')[0]; // "YYYY-MM-DD"
    if (!dayMap[date]) {
      dayMap[date] = slot;
    } else {
      // Replace if this slot is closer to noon
      const currentHour  = new Date(dayMap[date].dt * 1000).getUTCHours();
      const candidateHour = new Date(slot.dt * 1000).getUTCHours();
      if (Math.abs(candidateHour - 12) < Math.abs(currentHour - 12)) {
        dayMap[date] = slot;
      }
    }
  });

  const days = Object.entries(dayMap).slice(0, 5);

  return (
    <div className="stp-card fc-card">
      <div className="stp-section-title">📅 5-Day Forecast</div>

      <div className="fc-grid">
        {days.map(([date, slot]) => {
          const d       = new Date(`${date}T12:00:00`);
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
          const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const isBest  = date === bestDate;

          return (
            <div
              key={date}
              className={`fc-day ${isBest ? 'fc-day--best' : ''}`}
              title={isBest ? 'Best travel day' : ''}
            >
              {isBest && <div className="fc-best-badge">BEST ⭐</div>}
              <div className="fc-day-name">{dayName}</div>
              <div className="fc-day-date">{dateStr}</div>
              <div className="fc-day-icon">{getWeatherEmoji(slot.weather[0].icon)}</div>
              <div className="fc-day-temp">
                {Math.round(slot.main.temp)}{tempUnit}
              </div>
              <div className="fc-day-desc">{slot.weather[0].description}</div>
              <div className="fc-day-rain">
                💧 {Math.round((slot.pop ?? 0) * 100)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Forecast;
