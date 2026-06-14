import React from 'react';
import { getWeatherEmoji } from '../services/weatherService';
import './BestTravelDay.css';

/**
 * BestTravelDay
 * -------------
 * Highlights the single most suitable day in the 5-day forecast
 * for travel, as determined by getBestTravelDay().
 *
 * Props:
 *   best {object}  { dayName, dateStr, avgTemp, maxRain, rep, score }
 *                  returned by getBestTravelDay()
 *   unit {string}  'metric' | 'imperial'
 */
function BestTravelDay({ best, unit }) {
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const icon     = getWeatherEmoji(best.rep.weather[0].icon);
  const rainPct  = Math.round(best.maxRain * 100);

  // Short reason string shown under the day details
  const reason = [
    `Avg ${Math.round(best.avgTemp)}${tempUnit}`,
    `${rainPct}% rain chance`,
    best.rep.weather[0].description,
  ].join(' · ');

  return (
    <div className="stp-card btd-card">
      <div className="stp-section-title">🗓 Best Day to Travel</div>

      <div className="btd-body">
        <div className="btd-icon">{icon}</div>
        <div className="btd-day-name">{best.dayName}</div>
        <div className="btd-date">{best.dateStr}</div>

        {/* Score bar */}
        <div className="btd-score-bar-wrap" title={`Suitability score: ${best.score.toFixed(1)} / 10`}>
          <div
            className="btd-score-bar-fill"
            style={{ width: `${(best.score / 10) * 100}%` }}
          />
        </div>
        <div className="btd-score-label">
          Suitability: <strong>{best.score.toFixed(1)}</strong> / 10
        </div>

        <div className="btd-reason">{reason}</div>
      </div>
    </div>
  );
}

export default BestTravelDay;
