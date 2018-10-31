import React, { Component } from 'react';
import SearchBox from './components/SearchBox';
import Results from './services/Results'


interface  Result {
  name: string
  price: number
  size: number
  description: string
  link: string
  photo: string
  createdAt: Date
  updatedAt: Date
  hidden: boolean
  seen: boolean
  pinned: boolean
}

interface AppState {
  filterValue: string
  results: Result[]
  page: number
  pages: number
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      filterValue: '',
      results: [],
      page: 1,
      pages: 1
    }
  }

  searchChanged() {
    console.log('search changed', this.state.filterValue)
    this.fetchResults(1)
  }

  async fetchResults(page?: number) {
    console.log(this.state)
    const results = await Results.fetchPaginated({ filter: this.state.filterValue, page: page || 1})
    this.setState({
      results: results.results,
      page: results.page,
      pages: results.pages
    })

    return results;
  }

  componentDidMount() {
    this.fetchResults()
  }

  render() {
    return (
      <div>
        <header>immo-feed</header>
        <section>
          <SearchBox onChange={this.searchChanged.bind(this)} value={this.state.filterValue}></SearchBox>
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
              <span>{this.state.page} / {this.state.pages}</span>
              <span>Next</span>
            </div>
          </nav>
        </section>

        <main>
          <h2>Pinned</h2>
          <div className="results">
          {this.state.results.map(result => {
            return <a href={result.link} className="result">
                <input type="checkbox"/>
                <img src={result.photo} />
                <div className="result-title">{result.name}</div>
                <div className="result-description">{result.description}</div>
                <div className="result-date">{result.createdAt}</div>
                <div className="result-details">
                  <div className="result-detail">{result.price}</div>
                  <div className="result-detail">{result.size}</div>
                </div>
                <div className="result-actions">
                  <div className="result-action">{ result.pinned ? 'unpin': 'pin'}</div>
                  <div className="result-action">hide</div>
                </div>
              </a>
             })}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
