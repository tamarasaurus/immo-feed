import React, { Component, MouseEvent, ChangeEvent } from 'react'
import Pagination from './components/Pagination'
import { getAll, getPinned, getFilters, saveResult } from './services/Result'
import { DebounceInput } from 'react-debounce-input';

interface AppState {
  results: any[]
  pinned: any[]
  filters: any
  offset: number
  total: number
  search: string
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      offset: 0,
      results: [],
      pinned: [],
      filters: {},
      total: 100000,
      search: ''
    }

    this.offsetUpdated = this.offsetUpdated.bind(this)
    this.pinResult = this.pinResult.bind(this)
    this.searchUpdated = this.searchUpdated.bind(this)
  }

  public componentDidMount() {
    this.renderResults()
  }

  public pinResult(result: any) {
    saveResult(Object.assign(result, { pinned: true })).then(() => {
      this.renderResults()
    })
  }

  public unpinResult(result: any) {
    saveResult(Object.assign(result, { pinned: false })).then(() => {
      this.renderResults()
    })
  }

  public offsetUpdated(offset: number) {
    if (this.state.offset !== offset) {
      this.setState({ offset }, () => this.renderResults())
    }
  }

  public searchUpdated(event: ChangeEvent<HTMLInputElement>) {
    const search = event.target.value

    if (this.state.search !== search) {
      this.setState({ search }, () => this.renderResults())
    }
  }

  public renderResults() {
    this.fetchResults().then(([results, pinned, filters ]) => {
      const { min_price, max_price, min_size, max_size, total } = filters[0]
      this.setState({
        results,
        pinned,
        total: parseInt(total, 10),
        filters: {
          price: [parseInt(min_price, 10), parseInt(max_price, 10)],
          size: [parseInt(min_size, 10), parseInt(max_size, 10)],
        },
       })
    })
  }

  public fetchResults() {
    return Promise.all([
      getAll(this.state.offset, this.state.search),
      getPinned(),
      getFilters(),
    ])
  }

  public render() {
    return (<>
      <div className="header">
        <h1>🏠 immo-feed</h1>
        <DebounceInput className="search" placeholder="Examples: Nantes | 44300 | T2 | Maison" debounceTimeout={400} onChange={this.searchUpdated}/>
        <Pagination total={this.state.total} offsetUpdated={this.offsetUpdated} offset={this.state.offset}/>
      </div>
      { this.state.pinned.length > 0 ?
        <>
          <h2>Pinned</h2>
          <ul className="list">
            {this.state.pinned.map((result) => {
                return <li
                    className="list-item"
                    key={result.id} id={result.id}>
                    <a href={result.link} target="_blank" className="list-item-photo" style={{backgroundImage: `url('${result.photo}')`}}></a>
                    <div className="list-item-details">
                      <div className="list-item-name">{result.name}</div>
                      <div className="list-item-date">{new Date(result.created).toLocaleDateString()} {new Date(result.created).toLocaleTimeString()}</div>
                      <div className="list-item-description">{result.description}</div>
                    </div>
                    <div className="list-item-data">
                      {result.size > 0 ? <span className="pill">{result.size}m²</span> : ''}
                      {result.price > 0 ? <span className="pill">€{result.price.toLocaleString()}</span> : ''}
                    </div>
                    <div className="list-item-actions">
                      <button onClick={this.unpinResult.bind(this, result)} className="action hover"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#ccc" d="M16 4.588l2.833 8.719H28l-7.416 5.387 2.832 8.719L16 22.023l-7.417 5.389 2.833-8.719L4 13.307h9.167L16 4.588z"/></svg></button>
                      <button className="action"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#ccc" d="M16 5C9.935 5 5 9.934 5 16c0 6.067 4.935 11 11 11s11-4.933 11-11c0-6.066-4.935-11-11-11zm0 2.75c1.777 0 3.427.569 4.775 1.53L9.279 20.778A8.214 8.214 0 0 1 7.75 16c0-4.549 3.701-8.25 8.25-8.25zm0 16.5a8.2 8.2 0 0 1-4.775-1.53l11.494-11.497A8.205 8.205 0 0 1 24.25 16c0 4.547-3.701 8.25-8.25 8.25z"/></svg></button>
                    </div>
                </li>
                })}
            </ul>
        </>
        : ''
      }
      {this.state.results.length > 0 ?
          <>
          <h2>Results</h2>
          <ul className="list">
            {this.state.results.map((result) => {
                return <li
                    className="list-item"
                    key={result.id} id={result.id}>
                    <a href={result.link} target="_blank" className="list-item-photo" style={{backgroundImage: `url('${result.photo}')`}}></a>
                    <div className="list-item-details">
                      <div className="list-item-name">{result.name}</div>
                      <div className="list-item-date">{new Date(result.created).toLocaleDateString()} {new Date(result.created).toLocaleTimeString()}</div>
                      <div className="list-item-description">{result.description}</div>
                    </div>
                    <div className="list-item-data">
                      {result.size > 0 ? <span className="pill">{result.size}m²</span> : ''}
                      {result.price > 0 ? <span className="pill">€{result.price.toLocaleString()}</span> : ''}
                    </div>
                    <div className="list-item-actions">
                      <button onClick={this.pinResult.bind(this, result)}className="action"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#ccc" d="M16 4.588l2.833 8.719H28l-7.416 5.387 2.832 8.719L16 22.023l-7.417 5.389 2.833-8.719L4 13.307h9.167L16 4.588z"/></svg></button>
                      <button className="action"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#ccc" d="M16 5C9.935 5 5 9.934 5 16c0 6.067 4.935 11 11 11s11-4.933 11-11c0-6.066-4.935-11-11-11zm0 2.75c1.777 0 3.427.569 4.775 1.53L9.279 20.778A8.214 8.214 0 0 1 7.75 16c0-4.549 3.701-8.25 8.25-8.25zm0 16.5a8.2 8.2 0 0 1-4.775-1.53l11.494-11.497A8.205 8.205 0 0 1 24.25 16c0 4.547-3.701 8.25-8.25 8.25z"/></svg></button>
                    </div>
                </li>
            })}
          </ul>
        </>
      : <div className="empty">No results</div> }
    </>
    )
  }
}

export default App
