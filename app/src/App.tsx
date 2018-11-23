import React, { Component, ChangeEvent } from 'react'

interface AppState {
  results: any[]
  filters: any
  offset: number
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      offset: 0,
      results: [],
      filters: {},
    }
  }

  public componentDidMount() {
    this.fetchResults().then(([results, filters ]) => {
      const { min_price, max_price, min_size, max_size } = filters[0]
      this.setState({
        results,
        filters: {
          price: [parseInt(min_price), parseInt(max_price)],
          size: [parseInt(min_size), parseInt(max_size)]
        }
       })
    })
  }

  public fetchResults() {
    return Promise.all([
      fetch(new Request(`http://localhost:8000/results?offset=${this.state.offset}`), {
        mode: 'cors',
        method: 'get',
      }).then(response => response.json()),
      fetch(new Request('http://localhost:8000/filters'), {
        mode: 'cors',
        method: 'get',
      }).then(response => response.json())
    ])
  }

  public render() {
    return (
      <ul>
        {this.state.results.map((result) => {
          return <li key={result.id}>{result.id}: {result.name} <br/> {result.description}</li>
        })
      }
      </ul>
    )
  }
}

export default App
