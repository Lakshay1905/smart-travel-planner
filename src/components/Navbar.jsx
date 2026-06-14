import React from 'react';
import './Navbar.css';

/**
 * Navbar
 * ------
 * Top navigation bar with:
 *   - App branding
 *   - °C / °F unit toggle
 *   - Dark / light mode toggle
 *
 * Props:
 *   unit          {string}   'metric' | 'imperial'
 *   darkMode      {boolean}
 *   onUnitToggle  {function} called with 'metric' or 'imperial'
 *   onDarkModeToggle {function}
 */
function Navbar({ unit, darkMode, onUnitToggle, onDarkModeToggle }) {
  return (
    <nav className="stp-navbar">
      {/* Brand */}
      <div className="stp-navbar-brand">
        <div className="stp-brand-icon">✈️</div>
        <div>
          <div className="stp-brand-name">Smart Travel Planner</div>
          <div className="stp-brand-tagline">AI-powered trip insights</div>
        </div>
      </div>

      {/* Controls */}
      <div className="stp-navbar-controls">
        {/* Unit toggle */}
        <div className="stp-unit-toggle" role="group" aria-label="Temperature unit">
          <button
            className={`stp-unit-btn ${unit === 'metric' ? 'active' : ''}`}
            onClick={() => onUnitToggle('metric')}
            aria-pressed={unit === 'metric'}
          >
            °C
          </button>
          <button
            className={`stp-unit-btn ${unit === 'imperial' ? 'active' : ''}`}
            onClick={() => onUnitToggle('imperial')}
            aria-pressed={unit === 'imperial'}
          >
            °F
          </button>
        </div>

        {/* Dark / light mode */}
        <button
          className="stp-mode-btn"
          onClick={onDarkModeToggle}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
