import React, { useState, useEffect } from 'react';
import ResultList, { Result } from './components/ResultList';
import ResultSearch from './components/ResultSearch';
import ResultPagination from './components/ResultPagination';
import Sidebar from './components/Sidebar';
import { get } from './api';

import './styles/variables.css';
import './styles/layout.css';
import './styles/result-list.css';
import './styles/result-search.css';
import './styles/result-pagination.css';
import './styles/sidebar.css';

interface FilterState {
  total: number;
}

const PAGINATION_LIMIT = 40;

function App() {
  const [results, setResults] = useState<Result[]>([]);
  const [section, setSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [totalResults, setTotalResults] = useState(999999)

  useEffect(() => {
    setOffset(0);
  }, [section, searchQuery])

  useEffect(() => {
    const fetchFilterState = async () => {
      const { total } = await get('/filters');
      setTotalResults(total)
    }

    fetchFilterState();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const results: Result[] = await get(`/results?filter=${section}&search=${searchQuery}&offset=${offset}&limit=${PAGINATION_LIMIT}`)

      setResults(results)
      setTotalResults(results.length > 0 ? parseInt(results[0].total) : 0)
    }

    fetchData()
  }, [section, searchQuery, offset])

  return <div>
      <header>immo-feed</header>
      <main>
        <Sidebar onSectionChange={(value: string) => setSection(value)} />

        <section>
          <h2>{section} results ({ totalResults })</h2>
          <ResultSearch
            searchQuery={searchQuery}
            onSearchChange={(query: string) => setSearchQuery(query) }
          />

          <ResultPagination
            offset={offset}
            limit={PAGINATION_LIMIT}
            totalResults={totalResults}
            onOffsetChange={(offset: number) => setOffset(offset)}
          />

          <ResultList results={results} />
        </section>
      </main>
    </div>
};

export default App;
