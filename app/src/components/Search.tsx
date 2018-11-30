import React, { Component, ChangeEvent } from 'react'
import { debounce } from 'lodash'

interface SearchProps {
  searchUpdated: (text: string) => void
}

interface SearchState {
  text: string
}

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props)

    this.state = {
      text: ''
    }
  }

  public test() {
    console.log('debounced test')
  }

  private searchUpdated(event: ChangeEvent<HTMLInputElement>) {
    const { value } = event.target

    setTimeout(() => {
      this.props.searchUpdated(value)
    }, 400)
  }

  public render() {
    return (
        <input type="search" onChange={this.searchUpdated.bind(this)} />
    )
  }
}

export default Search
