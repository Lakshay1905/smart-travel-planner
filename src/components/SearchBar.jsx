import React, { useState } from 'react';
import './SearchBar.css';

/**
 * SearchBar
 * ---------
 * City search input with:
 *   - Client-side validation (empty, too short, numeric-only)
 *   - Enter-key support
 *   - Recent searches shown as clickable chips
 *
 * Props:
 *   onSearch       {function}  called with the trimmed city string
 *   loading        {boolean}
 *   recentSearches {string[]}  list of recently searched cities
 */
function SearchBar({ onSearch, loading, recentSearches }) {
  const [query, setQuery]   = useState('');
  const [error, setError]   = useState('');

  /** Validate input then call onSearch. */
  const handleSearch = () => {
    const city = query.trim();

    if (!city) {
      setError('Please enter a city name.');
      return;
    }
    if (city.length < 2) {
      setError('City name must be at least 2 characters.');
      return;
    }
    if (/^\d+$/.test(city)) {
      setError('Please enter a valid city name, not a number.');
      return;
    }

    setError('');
    onSearch(city);
  };

  /** Trigger search on Enter key. */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  /** Click a recent-search chip → fill input and search immediately. */
  const handleChipClick = (city) => {
    setQuery(city);
    setError('');
    onSearch(city);
  };

  return (
    <div className="stp-search-container">
      {/* Input row */}
      <div className="stp-search-row">
        <input
          className="stp-search-input"
          type="text"
          placeholder="Search city — e.g. Paris, Tokyo, New York…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          aria-label="City search"
          disabled={loading}
        />
        <button
          className="stp-search-btn"
          onClick={handleSearch}
          disabled={loading}
          aria-label="Search"
        >
          {loading ? '…' : 'Search'}
        </button>
      </div>

      {/* Validation error */}
      {error && (
        <p className="stp-search-error" role="alert">
          ⚠ {error}
        </p>
      )}

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="stp-recent-row" aria-label="Recent searches">
          <span className="stp-recent-label">Recent:</span>
          {recentSearches.map((city) => (
            <button
              key={city}
              className="stp-recent-chip"
              onClick={() => handleChipClick(city)}
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
