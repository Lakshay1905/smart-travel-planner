import React, { useState, useCallback } from 'react';

import Navbar            from './components/Navbar';
import SearchBar         from './components/SearchBar';
import WeatherCard       from './components/WeatherCard';
import Forecast          from './components/Forecast';
import TravelScore       from './components/TravelScore';
import PackingSuggestions from './components/PackingSuggestions';
import BestTravelDay     from './components/BestTravelDay';

import { fetchCurrentWeather, fetchForecast } from './services/weatherService';
import { calculateTravelScore }  from './utils/calculateTravelScore';
import { getPackingSuggestions } from './utils/getPackingSuggestions';
import { getBestTravelDay }      from './utils/getBestTravelDay';

import './App.css';

function App() {
  // ── Core data state ──────────────────────────────────────────
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData,   setForecastData]   = useState(null);

  // ── UI state ─────────────────────────────────────────────────
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [unit,     setUnit]     = useState('metric');   // 'metric' | 'imperial'
  const [darkMode, setDarkMode] = useState(true);

  // ── Recent searches (localStorage) ───────────────────────────
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('stp_recent') || '[]');
    } catch {
      return [];
    }
  });

  /** Save a city to the recent-searches list (max 5). */
  const saveRecent = useCallback((cityName) => {
    setRecentSearches(prev => {
      const updated = [
        cityName,
        ...prev.filter(r => r.toLowerCase() !== cityName.toLowerCase()),
      ].slice(0, 5);
      try { localStorage.setItem('stp_recent', JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  /**
   * Main search handler.
   * Fetches current weather + 5-day forecast in parallel,
   * then stores results in state.
   */
  const handleSearch = useCallback(async (city) => {
    setLoading(true);
    setError('');
    setCurrentWeather(null);
    setForecastData(null);

    try {
      const [weather, forecast] = await Promise.all([
        fetchCurrentWeather(city, unit),
        fetchForecast(city, unit),
      ]);
      setCurrentWeather(weather);
      setForecastData(forecast);
      saveRecent(weather.name);          // use the canonical name returned by API
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [unit, saveRecent]);

  /** Re-fetch when the user switches °C ↔ °F. */
  const handleUnitToggle = (newUnit) => {
    setUnit(newUnit);
    if (currentWeather) {
      handleSearch(currentWeather.name);   // re-fetch with new unit
    }
  };

  // ── Derived data (computed only when API data is available) ──
  const travelScore   = currentWeather && forecastData ? calculateTravelScore(currentWeather)  : null;
  const packingList   = currentWeather                 ? getPackingSuggestions(currentWeather) : null;
  const bestDay       = forecastData                   ? getBestTravelDay(forecastData)        : null;

  return (
    <div className={`app-wrapper ${darkMode ? 'dark' : 'light'}`}>
      {/* ── Navigation ── */}
      <Navbar
        unit={unit}
        darkMode={darkMode}
        onUnitToggle={handleUnitToggle}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <main className="app-main container-fluid py-4">
        {/* ── Search ── */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8 col-lg-6">
            <SearchBar
              onSearch={handleSearch}
              loading={loading}
              recentSearches={recentSearches}
            />
          </div>
        </div>

        {/* ── Loading indicator ── */}
        {loading && (
          <div className="text-center py-5">
            <div className="stp-spinner mb-3" />
            <p className="text-muted-light">Fetching weather data…</p>
          </div>
        )}

        {/* ── API error ── */}
        {error && !loading && (
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="stp-error-box">
                <span className="me-2">⚠</span>{error}
              </div>
            </div>
          </div>
        )}

        {/* ── Empty / welcome state ── */}
        {!loading && !currentWeather && !error && (
          <div className="stp-empty text-center py-5">
            <div className="stp-empty-icon">🌍</div>
            <h5 className="mt-3">Search for any destination to get started</h5>
            <p className="text-muted-light mt-1">
              Weather insights, travel scores, and packing tips — all in one place.
            </p>
          </div>
        )}

        {/* ── Results ── */}
        {currentWeather && !loading && (
          <div className="fade-in">
            {/* Row 1 – Current weather + Travel score */}
            <div className="row g-3 mb-3">
              <div className="col-12 col-lg-7">
                <WeatherCard weather={currentWeather} unit={unit} />
              </div>
              <div className="col-12 col-lg-5 d-flex flex-column gap-3">
                {travelScore && <TravelScore score={travelScore} />}
                {bestDay     && <BestTravelDay best={bestDay} unit={unit} />}
              </div>
            </div>

            {/* Row 2 – 5-day forecast */}
            {forecastData && (
              <div className="row g-3 mb-3">
                <div className="col-12">
                  <Forecast
                    forecasts={forecastData}
                    bestDate={bestDay?.date}
                    unit={unit}
                  />
                </div>
              </div>
            )}

            {/* Row 3 – Packing suggestions */}
            {packingList && (
              <div className="row g-3">
                <div className="col-12">
                  <PackingSuggestions suggestions={packingList} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer text-center py-3">
        <small className="text-muted-light">
          Smart Travel Planner · Powered by OpenWeatherMap
        </small>
      </footer>
    </div>
  );
}

export default App;
