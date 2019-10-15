import React, { useState, useEffect } from 'react';
import ResultList from './components/ResultList';
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
  total: string;
}

const PAGINATION_OFFSET = 40;

function App() {
  const [section, setSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [filterState, setFilterState] = useState<FilterState>({
    total: '9999999'
  })

  useEffect(() => {
    setOffset(0);
  }, [section, searchQuery])

  useEffect(() => {
    const fetchFilterState = async () => {
      const state  = await get('/filters');
      setFilterState(state[0])
    }

    fetchFilterState();
  }, [])

  const { total } = filterState;

  return <div>
      <header>immo-feed</header>
      <main>
        <Sidebar onSectionChange={(value: string) => setSection(value)} />

        <section>
          <h2>{section} results</h2>
          <ResultSearch
            searchQuery={searchQuery}
            onSearchChange={(query: string) => setSearchQuery(query) }
          />

          <ResultPagination
            offset={offset}
            limit={PAGINATION_OFFSET}
            totalResults={parseInt(total)}
            onOffsetChange={(offset: number) => setOffset(offset)}
          />

          <ResultList
            search={searchQuery}
            filter={section}
            offset={offset}
            limit={PAGINATION_OFFSET}
          />
        </section>
      </main>
    </div>
};

export default App;
