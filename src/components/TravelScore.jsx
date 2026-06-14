import React from 'react';
import './TravelScore.css';

/**
 * TravelScore
 * -----------
 * Displays the travel suitability score as an animated SVG circle gauge
 * with a label and explanation text.
 *
 * Props:
 *   score {object}  { score: number, label: string, desc: string }
 *                   returned by calculateTravelScore()
 */
function TravelScore({ score }) {
  const { score: value, label, desc } = score;

  // Circle gauge math
  const radius      = 28;
  const circumference = 2 * Math.PI * radius;
  const filled      = (value / 10) * circumference;

  // Color changes based on score bracket
  const color =
    value >= 7 ? '#1e90ff' :
    value >= 5 ? '#f0a500' :
                 '#ff6b6b';

  return (
    <div className="stp-card ts-card">
      <div className="stp-section-title">🎯 Travel Suitability Score</div>

      <div className="ts-body">
        {/* SVG circle gauge */}
        <div className="ts-circle-wrap" aria-label={`Score ${value} out of 10`}>
          <svg width="72" height="72" viewBox="0 0 72 72" className="ts-svg">
            {/* Background track */}
            <circle
              cx="36" cy="36" r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
            />
            {/* Filled arc */}
            <circle
              cx="36" cy="36" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeDasharray={`${filled} ${circumference - filled}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          </svg>
          {/* Score text inside circle */}
          <div className="ts-circle-text">
            <span className="ts-score-num" style={{ color }}>{value.toFixed(1)}</span>
            <span className="ts-score-denom">/10</span>
          </div>
        </div>

        {/* Label + description */}
        <div className="ts-info">
          <div className="ts-label" style={{ color }}>{label}</div>
          <div className="ts-desc">{desc}</div>
        </div>
      </div>
    </div>
  );
}

export default TravelScore;
