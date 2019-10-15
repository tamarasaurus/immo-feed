import React, { useState, ChangeEvent } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface ResultSearchProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

function ResultSearch({ searchQuery, onSearchChange }: ResultSearchProps) {
  const [query, setQuery] = useState(searchQuery)
  const [ handleSearchChange ] = useDebouncedCallback((value: string) => {
    setQuery(value)
    onSearchChange(value);
  }, 500);

  return <div className="result-search"><input
    className="result-search"
    name="Search results"
    type="search"
    placeholder="Search by name, price, location"
    defaultValue={query}
    onChange={(event: ChangeEvent<HTMLInputElement>) => handleSearchChange(event.currentTarget.value)}
    /></div>
};

export default ResultSearch;
