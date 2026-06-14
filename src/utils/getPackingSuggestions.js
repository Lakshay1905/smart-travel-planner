/**
 * getPackingSuggestions.js
 * ------------------------
 * Generates categorised packing recommendations based on current
 * weather conditions (temperature, rain, wind).
 *
 * Returns an array of category objects:
 *   [{ category: string, emoji: string, items: string[] }, …]
 */

/**
 * @param {object} currentWeather - OWM /weather response object
 * @returns {Array<{ category: string, emoji: string, items: string[] }>}
 */
export function getPackingSuggestions(currentWeather) {
  const temp      = currentWeather.main.temp;
  const weatherId = currentWeather.weather[0].id;
  const windSpeed = currentWeather.wind.speed;

  const suggestions = [];

  // ── 1. Clothing based on temperature ─────────────────────────
  if (temp >= 28) {
    suggestions.push({
      category: 'Hot Weather Clothing',
      emoji: '🌞',
      items: [
        'Light, breathable clothing',
        'Shorts and sleeveless tops',
        'Comfortable sandals or sneakers',
        'Swimwear (if near water)',
      ],
    });
    suggestions.push({
      category: 'Sun Protection',
      emoji: '🧴',
      items: [
        'Sunscreen SPF 50+',
        'UV-blocking sunglasses',
        'Wide-brim hat or cap',
        'After-sun lotion',
      ],
    });
    suggestions.push({
      category: 'Hydration',
      emoji: '💧',
      items: [
        'Reusable insulated water bottle',
        'Electrolyte packets',
      ],
    });
  } else if (temp >= 18) {
    suggestions.push({
      category: 'Mild Weather Clothing',
      emoji: '🌤',
      items: [
        'Light jacket or hoodie',
        'Layerable outfits (t-shirt + overshirt)',
        'Comfortable walking shoes',
        'A compact umbrella (just in case)',
      ],
    });
  } else if (temp >= 8) {
    suggestions.push({
      category: 'Cool Weather Clothing',
      emoji: '🧥',
      items: [
        'Warm jacket or fleece',
        'Long-sleeved shirts',
        'Jeans or warm trousers',
        'Closed-toe shoes',
      ],
    });
  } else {
    // Very cold (below 8 °C)
    suggestions.push({
      category: 'Cold Weather Clothing',
      emoji: '🧤',
      items: [
        'Heavy winter coat',
        'Thermal base layers (top & bottom)',
        'Insulated boots',
        'Gloves and warm socks',
        'Beanie / winter hat',
        'Scarf',
      ],
    });
  }

  // ── 2. Rain gear ─────────────────────────────────────────────
  // OWM codes: 2xx Thunderstorm, 3xx Drizzle, 5xx Rain
  const isRainy = weatherId >= 200 && weatherId < 600;
  if (isRainy) {
    suggestions.push({
      category: 'Rain Gear',
      emoji: '☂️',
      items: [
        'Compact travel umbrella',
        'Waterproof jacket / raincoat',
        'Waterproof footwear or galoshes',
        'Waterproof bag cover or dry bags',
        'Extra change of clothes',
      ],
    });
  }

  // ── 3. Snow gear ─────────────────────────────────────────────
  // OWM codes: 6xx Snow
  const isSnowy = weatherId >= 600 && weatherId < 700;
  if (isSnowy) {
    suggestions.push({
      category: 'Snow Gear',
      emoji: '❄️',
      items: [
        'Snow boots with good grip',
        'Waterproof outer layer',
        'Hand warmers',
        'Snow goggles (if at altitude)',
      ],
    });
  }

  // ── 4. Wind protection ────────────────────────────────────────
  if (windSpeed > 10) {
    suggestions.push({
      category: 'Wind Protection',
      emoji: '💨',
      items: [
        'Windbreaker jacket',
        'Secure hat or cap (avoid loose ones)',
      ],
    });
  }

  // ── 5. Always-pack essentials ────────────────────────────────
  suggestions.push({
    category: 'Travel Essentials',
    emoji: '🎒',
    items: [
      'Passport / government-issued ID',
      'Travel insurance documents',
      'Phone charger & power bank',
      'Local currency and/or travel cards',
      'First aid kit (plasters, pain relief)',
      'Reusable shopping bag',
    ],
  });

  return suggestions;
}
