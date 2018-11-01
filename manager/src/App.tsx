import React, { Component, ChangeEvent } from 'react';
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

  searchChanged(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ filterValue: event.target.value })
    this.fetchResults(1)
  }

  searchCleared(event: KeyboardEvent) {
    if (event.keyCode === 8) {
      this.setState({ filterValue: ''})
    }
  }

  async fetchResults(page: number) {
    const params = { filter: this.state.filterValue, page }
    const response = await Results.fetchPaginated(params)

    this.setState({
      results: response.results,
      page: response.page,
      pages: response.pages
    })

    return response;
  }

  pageIncreased() {
    const pages = this.state.pages

    if (this.state.page < pages) {
      this.fetchResults(Math.min(pages, this.state.page + 1))
    }
  }

  pageDecreased() {
    if (this.state.page > 1) {
      this.fetchResults(Math.max(1, this.state.page - 1))
    }
  }

  componentDidMount() {
    this.fetchResults(1)
  }

  render() {
    return (
      <div>
        <header>immo-feed</header>
        <section>
          <input className="search" placeholder="Search results" type="text" onChange={this.searchChanged.bind(this)} onKeyDown={this.searchCleared.bind(this)} />
          <nav>
            <div className="filter">
              <div className="filter-item">
                <span className="filter-name">price</span>
                <span className="filter-info">0</span>
                <input min="0" max="3000000" type="range" />
                <div className="filter-info">3000000</div>
              </div>
              <div className="filter-item">
                <span className="filter-name">size</span>
                <span className="filter-info">0</span>
                <input type="range" />
                <span className="filter-info">10000</span>
              </div>
            </div>
            <select className="actions">
              <option className="action-item">hide</option>
              <option className="action-item">pin</option>
            </select>
            <select className="sort">
              <option className="sort-item">by date ^</option>
              <option className="sort-item">by price ^</option>
              <option className="sort-item">by size ^</option>
            </select>
            <select className="export">
              <option className="export-option">Export current filters</option>
              <option className="export-option">Export JSON</option>
              <option className="export-option">Export CSV</option>
            </select>
            <div className="pagination">
              <span className="pagination-button" onClick={this.pageDecreased.bind(this)}>Prev</span>
              <span className="pagination-number">{this.state.page} / {this.state.pages}</span>
              <span className="pagination-button" onClick={this.pageIncreased.bind(this)}>Next</span>
            </div>
          </nav>
        </section>

        <main>
          <h3>Results</h3>
          <div className="results">
          {this.state.results.map(result => {
            return <div key={result.link} className="result">
                <a href={result.link}>
                  <img src={result.photo} />
                </a>
                <div className="result-info">
                  <span className="column column-full">
                    <div className="result-title">{result.name}</div>
                    <div className="result-date">{new Date(`${result.createdAt}`).toLocaleString()}</div>
                    <div className="result-details">€{result.price.toLocaleString()} | {result.size}m²</div>
                    <div className="result-description">{result.description}</div>
                  </span>
                  <span className="result-actions">
                    <div className="result-action good">⚪</div>
                    <div className="result-action bad">❌</div>
                  </span>
                </div>
              </div>
             })}
          </div>
        </main>
      </div>
    );
  }
}

export default App;
