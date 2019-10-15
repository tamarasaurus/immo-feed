import React, { useState } from 'react';
import ResultList from './components/ResultList';
import ResultSearch from './components/ResultSearch';
import Sidebar from './components/Sidebar';

import './styles/variables.css';
import './styles/layout.css';
import './styles/result-list.css';
import './styles/result-search.css';
import './styles/sidebar.css';

function App() {
  const [section, setSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSectionChange = (section: string) => {
    setSection(section);
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  }

  return <div>
      <header>immo-feed</header>
      <main>
        <Sidebar filterBySection={handleSectionChange} />
        <section>
          <ResultSearch searchQuery={searchQuery} onSearchChange={handleSearchChange}/>
          <ResultList search={searchQuery} filter={section}/>
        </section>
      </main>
    </div>
};

export default App;
