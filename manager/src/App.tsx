import React, { Component, ChangeEvent } from 'react';
import Results from './services/Results'
import ResultItem from './components/ResultItem'
import { pickBy, identity } from 'lodash'

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
  pinned: Result[]
  results: Result[]
  page: number
  pages: number
  minPrice?: string
  maxPrice?: string
  minSize?: string
  maxSize?: string
  [name: string]: any
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      filterValue: '',
      results: [],
      pinned: [],
      page: 1,
      pages: 1
    }
  }

  async fetchResults(page: number) {
    const {
      filterValue,
      minPrice,
      maxPrice,
      minSize,
      maxSize
    } = this.state

    const params = pickBy({
      filterValue,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      page
    }, identity)

    const response = await Results.fetchAll(params)
    const pinned = await Results.fetchPinned()

    this.setState({
      pinned,
      results: response.results,
      page: response.page,
      pages: response.pages
    })

    return response;
  }

  handlePageIncrease() {
    const pages = this.state.pages

    if (this.state.page < pages) {
      this.fetchResults(Math.min(pages, this.state.page + 1))
    }
  }

  handlePageDecrease() {
    if (this.state.page > 1) {
      this.fetchResults(Math.max(1, this.state.page - 1))
    }
  }

  searchCleared(event: KeyboardEvent) {
    if (event.keyCode === 8) {
      this.setState({ filterValue: ''})
    }
  }

  filterChanged(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ [event.target.name]: event.target.value })
  }

  componentDidMount() {
    this.fetchResults(1)
  }

  onPin(id: string) {
    Results.pin(id).then(() => this.fetchResults(this.state.page))
  }

  onUnpin(id: string) {
    Results.unpin(id).then(() => this.fetchResults(this.state.page))
  }

  onHide(id: string) {
    Results.hide(id).then(() => this.fetchResults(this.state.page))
  }

  componentDidUpdate(prevProps: any, prevState: AppState) {
    if (prevState.filterValue !== this.state.filterValue ||
      prevState.minPrice !== this.state.minPrice ||
      prevState.maxPrice !== this.state.maxPrice ||
      prevState.minSize !== this.state.minSize ||
      prevState.maxSize !== this.state.maxSize) {
        this.fetchResults(1)
    }
  }

  // @TODO - If set as pinned, also set seen, same with hidden
  // @TODO - Fetch pinned items first
  // @TODO - Add personal note to the listing, add icon on card for that
  // @TODO - Add a checkbox for 'Show hidden'
  render() {
    return (
      <div>
        <header>🏠 immo-feed</header>
        <main>
        <aside>
          { this.state.pinned.length > 0 ?
              <section>
              <h3 className="result-group">Pinned</h3>
              <div className="results">
                {this.state.pinned.map((result: any) =>
                  <ResultItem
                    onHide={this.onHide.bind(this)}
                    onUnpin={this.onUnpin.bind(this)}
                    onPin={this.onPin.bind(this)}
                    key={result.link} data={result}
                  />
                )}
              </div>
            </section>
            : ''
          }

          <h3 className="result-group">All results</h3>
          <section>
          <input name="filterValue" className="search" placeholder="Search results" type="text" onChange={this.filterChanged.bind(this)} onKeyDown={this.searchCleared.bind(this)} />
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
          <nav>
            <div className="filter">
            <div className="filter-item">
              <span className="filter-name">Price</span>
              <span className="filter-info">between
                <input name="minPrice" onChange={this.filterChanged.bind(this)} defaultValue={this.state.minPrice} type="text"/> and
                <input name="maxPrice" onChange={this.filterChanged.bind(this)} defaultValue={this.state.maxPrice} type="text"/></span>
            </div>
            <div className="filter-item">
              <span className="filter-name">Size</span>
              <span className="filter-info">between
                <input name="minSize" onChange={this.filterChanged.bind(this)} defaultValue={this.state.minSize} type="text"/> and
                <input name="maxSize" onChange={this.filterChanged.bind(this)} defaultValue={this.state.maxSize} type="text"/></span>
            </div>
            </div>
            <div className="pagination">
              <span className="pagination-button" onClick={this.handlePageDecrease.bind(this)}>Prev</span>
              <span className="pagination-number">{this.state.page} / {this.state.pages}</span>
              <span className="pagination-button" onClick={this.handlePageIncrease.bind(this)}>Next</span>
            </div>
          </nav>

        </section>
          <section>
            <div className="results">
              {this.state.results.map((result: any) =>
                <ResultItem
                  onHide={this.onHide.bind(this)}
                  onUnpin={this.onUnpin.bind(this)}
                  onPin={this.onPin.bind(this)}
                  key={result.link} data={result}
                />
              )}
            </div>
          </section>
          </aside>
        </main>
      </div>
    );
  }
}

export default App;
