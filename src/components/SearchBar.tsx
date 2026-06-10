import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import { useGeocoding } from "../hooks/useGeocoding";
import { useWeatherContext } from "../context/WeatherContext";
import styles from "./SearchBar.module.css";

export default function SearchBar(): React.ReactElement {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { selectCity } = useWeatherContext();
  
  // Use custom hook for fetching
  const { results: searchResults, loading: searchLoading, error: searchError, clearResults } = useGeocoding(debouncedQuery);

  // Sync debounced input value with centralized search state
  useEffect(() => {
    setIsOpen(debouncedQuery.trim().length >= 2);
  }, [debouncedQuery]);

  // Close autocomplete dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClear = () => {
    setQuery("");
    clearResults();
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleSelectResult = (index: number) => {
    const city = searchResults[index];
    if (city) {
      selectCity(city);
      setQuery(city.name);
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || searchResults.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < searchResults.length) {
          handleSelectResult(activeIndex);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.inputWrapper}>
        <span className={styles.searchIcon}>
          <Search size={20} />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search location worldwide..."
          className={styles.searchInput}
          aria-label="Search location"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />
        {searchLoading ? (
          <span className={styles.spinner}>
            <Loader2 size={18} />
          </span>
        ) : query ? (
          <button
            onClick={handleClear}
            className={styles.clearButton}
            aria-label="Clear search query"
            type="button"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      {isOpen && (
        <div ref={dropdownRef} className={styles.dropdown} role="listbox">
          {searchError ? (
            <div className={styles.dropdownError}>{searchError}</div>
          ) : searchResults.length > 0 ? (
            searchResults.map((city, idx) => {
              const isActive = idx === activeIndex;
              const locationDetail = [city.admin1, city.country]
                .filter(Boolean)
                .join(", ");

              return (
                <div
                  key={city.id}
                  onClick={() => handleSelectResult(idx)}
                  className={`${styles.dropdownItem} ${
                    isActive ? styles.dropdownItemActive : ""
                  }`}
                  role="option"
                  aria-selected={isActive}
                >
                  <span className={styles.cityName}>{city.name}</span>
                  <span className={styles.cityMeta}>{locationDetail}</span>
                </div>
              );
            })
          ) : (
            <div className={styles.dropdownEmpty}>No locations found</div>
          )}
        </div>
      )}
    </div>
  );
}
