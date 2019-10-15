import React from 'react';
import ResultList from './components/ResultList';
import Sidebar from './components/Sidebar';

import './styles/variables.css';
import './styles/layout.css';
import './styles/result-list.css';
import './styles/sidebar.css';

function App() {
  const filterBySection = (section: string) => {
    console.log('filter by section', section)
  }

  return <div className="App">
      <header className="App-header">
        immo-feed
      </header>
      <main>
        <Sidebar filterBySection={filterBySection} />
        <ResultList />
      </main>
    </div>
};

export default App;
