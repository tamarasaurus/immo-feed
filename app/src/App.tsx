import React, { Component, ChangeEvent } from 'react'

interface AppState {
  results: any[]
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props)

    this.state = {
      results: [],
    }
  }

  public componentDidMount() {
    this.fetchResults().then((results: any[]) => {
      this.setState({ results })
    })
  }

  public fetchResults() {
    return fetch(new Request('http://localhost:8000/results'), {
      mode: 'cors',
      method: 'get',
    }).then(response => response.json())
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
