import React, { useState, ChangeEvent, FormEvent } from 'react';
import "@/app/routes/home/components/SearchBar.css"
import { ApplicationsFilters } from '@/types/api';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}


function SearchBar({ placeholder = "Search...", onSearch}: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="searchbar-container" role="search" aria-label="Application search">
            {/* Visually hidden label for screen readers */}
            <label htmlFor="app-search" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>Search applications</label>

            <input
                id="app-search"
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={placeholder}
                className="searchbar-input"
                aria-label={placeholder}
            />
            <button type="submit" className="searchbar-button">
                <svg className="searchbar-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="searchbar-button-text">Search</span>
            </button>
        </form>
    );
}

export default SearchBar;