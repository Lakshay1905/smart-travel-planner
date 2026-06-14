/**
 * getBestTravelDay.js
 * --------------------
 * Analyses a 5-day / 3-hour OWM forecast and identifies the single
 * best day to travel, based on temperature comfort, rain probability,
 * wind, and the absence of severe weather events.
 *
 * Algorithm:
 *   1. Group the 3-hour forecast slots by calendar date.
 *   2. For each date compute a composite score (higher = better).
 *   3. Return metadata for the highest-scoring date.
 */

/**
 * @param {object} forecastData - OWM /forecast response (contains `list` array)
 * @returns {{
 *   date:    string,   // "YYYY-MM-DD"
 *   dayName: string,   // e.g. "Tuesday"
 *   dateStr: string,   // e.g. "Jun 17"
 *   score:   number,
 *   avgTemp: number,
 *   maxRain: number,   // highest pop (0–1) across the day's slots
 *   rep:     object,   // a representative forecast slot (mid-day)
 * }}
 */
export function getBestTravelDay(forecastData) {
  // ── Step 1: Group slots by date ──────────────────────────────
  const dayMap = {};

  forecastData.list.forEach((slot) => {
    const date = slot.dt_txt.split(' ')[0]; // "YYYY-MM-DD"
    if (!dayMap[date]) dayMap[date] = [];
    dayMap[date].push(slot);
  });

  // ── Step 2: Score each date ───────────────────────────────────
  const scored = Object.entries(dayMap).map(([date, slots]) => {
    // Average temperature across all 3-hour slots for the day
    const avgTemp = slots.reduce((sum, s) => sum + s.main.temp, 0) / slots.length;

    // Highest rain probability (pop = probability of precipitation, 0–1)
    const maxRain = Math.max(...slots.map((s) => s.pop ?? 0));

    // Average wind speed
    const avgWind = slots.reduce((sum, s) => sum + s.wind.speed, 0) / slots.length;

    // Flag if any slot has severe weather (thunderstorm / snow)
    const hasSevere = slots.some((s) => {
      const id = s.weather[0].id;
      return (id >= 200 && id < 300) || (id >= 600 && id < 700);
    });

    // ── Composite score (start at 10, apply penalties) ──
    let score = 10;

    // Temperature penalty
    if (avgTemp < 0 || avgTemp > 40)       score -= 3;
    else if (avgTemp < 5 || avgTemp > 35)  score -= 2;
    else if (avgTemp < 10 || avgTemp > 30) score -= 1;

    // Rain probability penalty (0–1 scale → up to –4 pts)
    score -= maxRain * 4;

    // Wind penalty
    if (avgWind > 15)      score -= 1.5;
    else if (avgWind > 10) score -= 0.5;

    // Severe weather hard penalty
    if (hasSevere) score -= 2;

    // Representative slot: pick the slot closest to midday
    const rep = slots.reduce((closest, s) => {
      const hour = new Date(s.dt * 1000).getUTCHours();
      const prevHour = new Date(closest.dt * 1000).getUTCHours();
      return Math.abs(hour - 12) < Math.abs(prevHour - 12) ? s : closest;
    }, slots[0]);

    return { date, score: Math.max(0, score), avgTemp, maxRain, avgWind, rep };
  });

  // ── Step 3: Pick the best date ───────────────────────────────
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  // ── Step 4: Human-readable labels ────────────────────────────
  // Add "T12:00:00" so the Date is parsed in local time (avoids UTC offset issues)
  const d = new Date(`${best.date}T12:00:00`);
  const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return { ...best, dayName, dateStr };
}
