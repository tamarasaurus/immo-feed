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
              <span onClick={this.pageDecreased.bind(this)}>Prev</span>
              <span>{this.state.page} / {this.state.pages}</span>
              <span onClick={this.pageIncreased.bind(this)}>Next</span>
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
                  <span className="column column-full column-middle">
                    <div className="result-title">{result.name}</div>
                    <div className="result-description">{result.description}</div>
                  </span>
                  <span className="column column-middle">
                    <div className="result-date">{new Date(`${result.createdAt}`).toLocaleString()}</div>
                    <div className="result-details">
                      <div className="result-detail">{result.price}</div>
                      <div className="result-detail">{result.size}</div>
                    </div>
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
