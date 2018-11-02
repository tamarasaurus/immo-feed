import React, { Component, ChangeEvent } from 'react';
import Results from './services/Results'
import ResultItem from './components/ResultItem'
import RangeFilter from './components/RangeFilter'

interface Result {
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
  results: {[groupName: string]: Result[]}
  page: number
  pages: number
  minPrice: number
  maxPrice: number
  minSize: number
  maxSize: number
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      filterValue: '',
      minPrice: 0,
      maxPrice: 600000,
      minSize: 20,
      maxSize: 200,
      results: { all: [], pinned: []},
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

  priceChanged(min: number, max: number) {
    console.log('price changed', min, max)
  }

  sizeChanged(min: number, max: number) {
    console.log('size changed', min, max)
  }

  componentDidMount() {
    this.fetchResults(1)
  }

  // @TODO - If set as pinned, also set seen, same with hidden
  // @TODO - Be able to view hidden results
  // @TODO - Improve search
  // @TODO - For displaying the results, sort them on the backend then group them by pinned (only pinned)
  // @TODO - For hiding, make an animation that ends with transform: scale(0), 200ms transition then gets removed
  // @TODO - Add personal note to the listing, add icon on card for that
  render() {
    return (
      <div>
        <header>🏠 immo-feed</header>
        <section>
          <input className="search" placeholder="Search results" type="text" onChange={this.searchChanged.bind(this)} onKeyDown={this.searchCleared.bind(this)} />
          <nav>
            <div className="filter">
              <RangeFilter onChange={this.priceChanged.bind(this)} label="Price" min={this.state.minPrice} max={this.state.maxPrice} />
              <RangeFilter onChange={this.sizeChanged.bind(this)} label="Size" min={this.state.minSize} max={this.state.maxSize} />
            </div>
            <div className="pagination">
              <span className="pagination-button" onClick={this.pageDecreased.bind(this)}>Prev</span>
              <span className="pagination-number">{this.state.page} / {this.state.pages}</span>
              <span className="pagination-button" onClick={this.pageIncreased.bind(this)}>Next</span>
            </div>
          </nav>
        </section>

        <main>
          <div className="toolbar">
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
          </div>

          {
            Object.entries(this.state.results).map((group: any) => {
              return <div key={group[0]}>
                  <h3 className="result-group">{group[0]}</h3>
                  <div className="results">{group[1].map((result: any) => <ResultItem key={result.link} data={result} /> )}</div>
              </div>
            })
          }
        </main>
      </div>
    );
  }
}

export default App;
