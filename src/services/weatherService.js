/**
 * weatherService.js
 * ------------------
 * Centralises all calls to the OpenWeatherMap API.
 * UI components never call fetch() directly – they use these
 * helper functions so the API key and base URL live in one place.
 *
 * API used: OpenWeatherMap Free Tier
 *   - Current weather : GET /data/2.5/weather
 *   - 5-day forecast  : GET /data/2.5/forecast  (3-hour intervals)
 *
 * Sign up for a free key at https://openweathermap.org/api
 * Then replace the value below or use an .env file:
 *   REACT_APP_OWM_API_KEY=your_key_here
 */

// ── API configuration ────────────────────────────────────────────────────────
const API_KEY = process.env.REACT_APP_OWM_API_KEY || 'bd5e378503939ddaee76f12ad7a97608';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ── Weather icon helper ──────────────────────────────────────────────────────

/** Map an OWM icon code to an emoji for lightweight display. */
const ICON_MAP = {
  '01d': '☀️',  '01n': '🌙',
  '02d': '⛅',  '02n': '⛅',
  '03d': '☁️',  '03n': '☁️',
  '04d': '☁️',  '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️',  '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

export const getWeatherEmoji = (iconCode) => ICON_MAP[iconCode] ?? '🌡️';

// ── Internal fetch wrapper ────────────────────────────────────────────────────

/**
 * Generic fetch helper.
 * Throws a user-friendly error message on non-2xx responses.
 *
 * @param {string} endpoint  - Full URL including query string
 * @returns {Promise<object>} - Parsed JSON body
 */
async function apiFetch(endpoint) {
  const response = await fetch(endpoint);

  if (response.status === 404) {
    throw new Error('City not found. Check the spelling and try again.');
  }
  if (response.status === 401) {
    throw new Error('Invalid API key. Please check your OpenWeatherMap configuration.');
  }
  if (!response.ok) {
    throw new Error(`Weather service error (${response.status}). Please try again shortly.`);
  }

  return response.json();
}

// ── Public API functions ─────────────────────────────────────────────────────

/**
 * Fetch the current weather conditions for a city.
 *
 * @param {string} city   - City name, e.g. "London" or "New York,US"
 * @param {string} units  - 'metric' (°C, m/s) | 'imperial' (°F, mph)
 * @returns {Promise<object>} - OWM current-weather response object
 */
export async function fetchCurrentWeather(city, units = 'metric') {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`;
  return apiFetch(url);
}

/**
 * Fetch a 5-day / 3-hour forecast for a city.
 *
 * @param {string} city   - City name
 * @param {string} units  - 'metric' | 'imperial'
 * @returns {Promise<object>} - OWM forecast response (contains `list` array)
 */
export async function fetchForecast(city, units = 'metric') {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`;
  return apiFetch(url);
}
