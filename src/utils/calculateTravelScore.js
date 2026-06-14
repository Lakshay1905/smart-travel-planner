/**
 * calculateTravelScore.js
 * -----------------------
 * Produces a travel suitability score (1–10) from current weather data.
 *
 * Scoring breakdown (all penalties subtracted from a starting score of 10):
 *
 *  Temperature comfort  → up to –3 pts
 *  Humidity             → up to –1.5 pts
 *  Wind speed           → up to –1.5 pts
 *  Rainfall (1 h)       → up to –2 pts
 *  Severe weather code  → up to –3 pts
 *
 * The result is clamped to [1, 10] and rounded to one decimal place.
 */

/**
 * @param {object} currentWeather - OWM /weather response object
 * @returns {{ score: number, label: string, desc: string }}
 */
export function calculateTravelScore(currentWeather) {
  let score = 10;

  const temp      = currentWeather.main.temp;          // °C or °F (same logic applies)
  const humidity  = currentWeather.main.humidity;      // %
  const windSpeed = currentWeather.wind.speed;         // m/s or mph
  const rain1h    = currentWeather.rain?.['1h'] ?? 0;  // mm in last hour (may not exist)
  const weatherId = currentWeather.weather[0].id;      // OWM condition code

  // ── 1. Temperature comfort ────────────────────────────────────
  // Ideal range: 18–28 °C (64–82 °F)
  if (temp < 0 || temp > 40)       score -= 3;
  else if (temp < 5 || temp > 35)  score -= 2;
  else if (temp < 10 || temp > 30) score -= 1;
  // 10–30 °C: no penalty; 18–28 °C: no penalty (sweet spot)

  // ── 2. Humidity ───────────────────────────────────────────────
  if (humidity > 85)      score -= 1.5;
  else if (humidity > 70) score -= 0.5;

  // ── 3. Wind speed ─────────────────────────────────────────────
  if (windSpeed > 15)      score -= 1.5;
  else if (windSpeed > 10) score -= 0.5;

  // ── 4. Rainfall ───────────────────────────────────────────────
  if (rain1h > 5)      score -= 2;
  else if (rain1h > 1) score -= 1;

  // ── 5. Severe weather (OWM condition codes) ───────────────────
  // 2xx = Thunderstorm, 3xx = Drizzle, 6xx = Snow, 7xx = Atmosphere (fog etc.)
  if (weatherId >= 200 && weatherId < 300)      score -= 3;   // thunderstorm
  else if (weatherId >= 300 && weatherId < 400) score -= 1;   // drizzle
  else if (weatherId >= 600 && weatherId < 700) score -= 2;   // snow
  else if (weatherId >= 700 && weatherId < 800) score -= 1;   // fog / haze

  // ── Clamp & round ─────────────────────────────────────────────
  const finalScore = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

  // ── Human-readable label & description ───────────────────────
  let label, desc;

  if (finalScore >= 9) {
    label = 'Excellent';
    desc  = 'Perfect conditions for travel and outdoor activities. Pack light and enjoy!';
  } else if (finalScore >= 7) {
    label = 'Good';
    desc  = 'Favorable weather with only minor inconveniences. Great time to explore.';
  } else if (finalScore >= 5) {
    label = 'Moderate';
    desc  = 'Acceptable conditions — some precautions advised. Check the forecast before heading out.';
  } else if (finalScore >= 3) {
    label = 'Poor';
    desc  = 'Challenging conditions. Plan indoor activities and carry weather gear.';
  } else {
    label = 'Avoid';
    desc  = 'Severe weather alert — consider postponing or adjusting travel plans.';
  }

  return { score: finalScore, label, desc };
}
