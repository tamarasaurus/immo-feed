import React, { Component } from 'react'
import Pagination from './components/Pagination'

interface AppState {
  results: any[]
  filters: any
  offset: number
  total: number
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      offset: 0,
      results: [],
      filters: {},
      total: 100000,
    }

    this.offsetUpdated = this.offsetUpdated.bind(this)
  }

  public componentDidMount() {
    this.renderResults()
  }

  public offsetUpdated(offset: number) {
    if (this.state.offset !== offset) {
      this.setState({ offset }, () => this.renderResults())
    }
  }

  public renderResults() {
    this.fetchResults().then(([results, filters ]) => {
      const { min_price, max_price, min_size, max_size, total } = filters[0]
      this.setState({
        results,
        total: parseInt(total, 10),
        filters: {
          price: [parseInt(min_price, 10), parseInt(max_price, 10)],
          size: [parseInt(min_size, 10), parseInt(max_size, 10)],
        },
       })
    })
  }

  public fetchResults() {
    console.log('fetch with offset', this.state.offset)
    return Promise.all([
      fetch(new Request(`http://localhost:8000/results?offset=${this.state.offset}`), {
        mode: 'cors',
        method: 'get',
      }).then(response => response.json()),
      fetch(new Request('http://localhost:8000/filters'), {
        mode: 'cors',
        method: 'get',
      }).then(response => response.json()),
    ])
  }

  public render() {
    return (<>
      <div className="header">
        <h1>🏠 immo-feed</h1>
        <Pagination total={this.state.total} offsetUpdated={this.offsetUpdated} offset={this.state.offset}/>
      </div>
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
                  </li>
        })}
    </ul>
    </>
    )
  }
}

export default App
