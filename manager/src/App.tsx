import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div>
        <header>immo-feed</header>
        <section>
          <input type="search" placeholder="Search by text" />
          <div className="filter">
            <div className="filter-item">
              <span className="filter-name">price</span>
              <span className="filter-info">minimum: 100</span>
              <input type="range" />
              <div className="filter-info">maximum: 2000000</div>
            </div>
            <div className="filter-item">
              <span className="filter-name">size</span>
              <span className="filter-info">minimum: 0</span>
              <input type="range" />
              <span className="filter-info">maximum: 10000</span>
            </div>
          </div>

          <nav>
            <ul className="actions">
              <li className="action-item">hide</li>
              <li className="action-item">pin</li>
            </ul>
            <ul className="sort">
              <li className="sort-item">by date ^</li>
              <li className="sort-item">by price ^</li>
              <li className="sort-item">by size ^</li>
            </ul>
            <div className="export">
              <div className="export-option">Export current filters</div>
              <div className="export-option">Export JSON</div>
              <div className="export-option">Export CSV</div>
            </div>
            <div className="pagination">
              <span>Prev</span>
              <span>1 / 10</span>
              <span>Next</span>
            </div>
          </nav>
        </section>

        <main>
          <h2>Pinned</h2>
          <ul className="results">
            <li className="result">
              <input type="checkbox"/>
              <div className="result-title">Name</div>
              <div className="result-description">Description</div>
              <div className="result-details">
                <div className="result-detail">price</div>
                <div className="result-detail">size</div>
              </div>
              <div className="result-actions">
                <div className="result-action">unpin</div>
                <div className="result-action">hide</div>
              </div>
            </li>
          </ul>
          <h2>All results</h2>
          <ul className="results">
            <li className="result">
              <input type="checkbox"/>
              <div className="result-title">Name</div>
              <div className="result-description">Description</div>
              <div className="result-details">
                <div className="result-detail">price</div>
                <div className="result-detail">size</div>
              </div>
              <div className="result-actions">
                <div className="result-action">pin</div>
                <div className="result-action">hide</div>
              </div>
            </li>
          </ul>
        </main>
      </div>
    );
  }
}

export default App;
