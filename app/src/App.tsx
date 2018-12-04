import React, { Component, MouseEvent, ChangeEvent } from 'react'
import Pagination from './components/Pagination'
import { getAll, getPinned, getFilters, saveResult } from './services/Result'
import { DebounceInput } from 'react-debounce-input'
import PinnedResult from './components/PinnedResult'
import Result from './components/Result'
import Dropdown from './components/Dropdown'
import InputRange from 'react-input-range'
import debounce from 'lodash/debounce'

interface AppState {
  results: any[]
  pinned: any[]
  filters: any
  offset: number
  total: number
  search: string
  price: any
  loading: boolean
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
      search: '',
      price: {},
      loading: true,
    }

    this.offsetUpdated = this.offsetUpdated.bind(this)
    this.pinResult = this.pinResult.bind(this)
    this.unpinResult = this.unpinResult.bind(this)
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
      this.setState({ search, offset: 0 }, () => this.renderResults())
    }
  }

  public renderResults() {
    this.fetchResults().then(([results, pinned, filters ]) => {
      const { min, max } = this.state.price
      const { min_price, max_price, min_size, max_size, total } = filters[0]

      const price = {
        min: parseInt(min_price, 10),
        max: parseInt(max_price, 10),
      }

      let state = {
        loading: false,
        results,
        pinned,
        total: parseInt(total, 10),
        filters: {
          price: [parseInt(min_price, 10), parseInt(max_price, 10)],
          size: [parseInt(min_size, 10), parseInt(max_size, 10)],
        },
       }

      if (min === undefined && max === undefined) {
        state = Object.assign(state, { price })
      }

      this.setState(state)
    })
  }

  public fetchResults() {
    return Promise.all([
      getAll(this.state.offset, this.state.search, this.state.price),
      getPinned(),
      getFilters(),
    ])
  }

  public render() {
    if (this.state.loading) {
      return <div className="loading">Loading...</div>
    }

    const priceFilterUpdated = debounce(() => {
      this.setState({ offset: 0 }, () => this.renderResults())
    }, 20)

    return (<>
      <div className="header">
        <h1>🏠 immo-feed</h1>
        <DebounceInput className="search" placeholder="Examples: Nantes | 44300 | T2 | Maison" debounceTimeout={400} onChange={this.searchUpdated}/>
        <Dropdown label="Filters">
          <InputRange
            formatLabel={(value: number, type: string) => {
              return `€${value.toLocaleString()}`
            }}
            minValue={this.state.filters.price[0]}
            maxValue={this.state.filters.price[1]}
            value={this.state.price}
            onChange={(price: any) => this.setState({ price }) }
            onChangeComplete={() => priceFilterUpdated()}
          />
        </Dropdown>
        <Pagination total={this.state.total} offsetUpdated={this.offsetUpdated} offset={this.state.offset}/>
      </div>
      { this.state.pinned.length > 0 ?
        <>
          <h2>Favourites</h2>
          <ul className="list">
            {this.state.pinned.map((result) => <PinnedResult key={result.id} result={result} unpinResult={this.unpinResult}/>)}
          </ul>
        </>
        : ''
      }
      {this.state.results.length > 0 ?
          <>
          <h2>Results</h2>
          <ul className="list">
            {this.state.results.map((result) => <Result key={result.id} result={result} pinResult={this.pinResult} />)}
          </ul>
        </>
      : <div className="empty">No results</div> }
    </>
    )
  }
}

export default App
