# ✈️ Smart Travel Planner

A professional, frontend-only React application that helps users plan trips by analysing real-time weather data and converting it into actionable travel insights.

---

## 🌟 Features

| Feature | Description |
|---|---|
| **Destination Search** | Search any city with input validation and recent-search chips |
| **Weather Dashboard** | Current temp, feels-like, humidity, wind, rainfall, pressure, visibility, cloud cover |
| **5-Day Forecast** | Grid view of the coming week with weather icons and rain probability |
| **Travel Suitability Score** | Custom 1–10 score with animated SVG gauge and explanation |
| **Best Travel Day** | Analyses the 5-day forecast and highlights the optimal day |
| **Smart Packing Assistant** | Categorised packing list based on temperature, rain, wind and snow |
| **°C / °F Toggle** | Re-fetches data instantly in the chosen unit |
| **Dark / Light Mode** | Persists through the session via toggle button |
| **Recent Searches** | Last 5 searches saved in localStorage and shown as chips |
| **Responsive Design** | Mobile-first layout using CSS Grid and Bootstrap |

---

## 🛠 Technologies Used

- **React 18** – Functional components + hooks (`useState`, `useEffect`, `useCallback`)
- **JavaScript ES6+** – Arrow functions, destructuring, optional chaining, async/await
- **CSS3** – CSS variables, Grid, Flexbox, animations
- **Bootstrap 5** – Responsive grid utility classes
- **OpenWeatherMap API** – Free-tier REST API for current weather + 5-day forecast
- **HTML5** – Semantic markup (`<nav>`, `<main>`, `<footer>`)

---

## 📁 Project Structure

```
smart-travel-planner/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / .css        # Top navigation, unit & theme toggles
│   │   ├── SearchBar.jsx / .css     # City search with validation + recent chips
│   │   ├── WeatherCard.jsx / .css   # Current weather hero + stats grid
│   │   ├── Forecast.jsx / .css      # 5-day forecast grid
│   │   ├── TravelScore.jsx / .css   # SVG circle gauge score
│   │   ├── PackingSuggestions.jsx / .css  # Collapsible packing categories
│   │   └── BestTravelDay.jsx / .css # Best day highlight card
│   ├── services/
│   │   └── weatherService.js        # All API calls in one place
│   ├── utils/
│   │   ├── calculateTravelScore.js  # Scoring algorithm
│   │   ├── getPackingSuggestions.js # Packing list generator
│   │   └── getBestTravelDay.js      # Best day algorithm
│   ├── App.jsx                      # Root component + state management
│   ├── App.css                      # App-level layout styles
│   ├── index.js                     # React entry point
│   └── index.css                    # Global styles
├── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/smart-travel-planner.git
cd smart-travel-planner
```

### 2. Install dependencies
```bash
npm install
```

### 3. Get a free API key
1. Sign up at [https://openweathermap.org/api](https://openweathermap.org/api)
2. Go to **My API keys** and copy your key
3. Note: new keys can take up to 2 hours to activate

### 4. Add your API key

**Option A – Environment variable (recommended):**
Create a `.env` file in the project root:
```
REACT_APP_OWM_API_KEY=your_api_key_here
```

**Option B – Direct substitution:**
Open `src/services/weatherService.js` and replace the fallback value:
```js
const API_KEY = 'your_api_key_here';
```

### 5. Start the development server
```bash
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000).

### 6. Build for production
```bash
npm run build
```

---

## 🧠 How the Algorithms Work

### Travel Suitability Score (`calculateTravelScore.js`)
Starts at 10 and applies penalties:
- **Temperature** outside 10–30 °C → –1 to –3 pts
- **Humidity** above 70 % → –0.5 to –1.5 pts
- **Wind speed** above 10 m/s → –0.5 to –1.5 pts
- **Rainfall** (last hour) → –1 to –2 pts
- **Severe weather** (thunderstorm/snow) → –2 to –3 pts

### Best Travel Day (`getBestTravelDay.js`)
Groups 3-hour slots by date, then scores each date using the same penalty system plus the maximum daily rain probability (`pop`). The date with the highest composite score is chosen.

### Packing Suggestions (`getPackingSuggestions.js`)
Rule-based: checks temperature brackets (< 8 °C, 8–18 °C, 18–28 °C, ≥ 28 °C), rain/snow weather codes, and wind speed to build relevant category lists.

---

## 🔮 Future Improvements

- [ ] Weather trend charts using Chart.js or Recharts
- [ ] Favourite destinations with localStorage persistence
- [ ] Trip date picker (plan for a future date)
- [ ] Map integration (Leaflet.js) showing the destination
- [ ] Air quality index (AQI) using the OWM Air Pollution API
- [ ] PWA support (offline caching of last search)
- [ ] Hourly forecast view
- [ ] Multi-city comparison

---

## 📄 License

MIT — free to use and modify for personal or commercial projects.

---

## 🙏 Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for the free weather API
- [Bootstrap](https://getbootstrap.com/) for the responsive grid system
- [Google Fonts – Inter](https://fonts.google.com/specimen/Inter) for typography
