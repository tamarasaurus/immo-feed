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
              <input type="range" />
            </div>
            <div className="filter-item">
              <span className="filter-name">size</span>
              <input type="range" />
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
            <div className="pagination">
              <span>Prev</span>
              <span>1 / 10</span>
              <span>Next</span>
            </div>
            <div className="export">
              <div className="export-option">Export current filters</div>
              <div className="export-option">Export JSON</div>
              <div className="export-option">Export CSV</div>
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
