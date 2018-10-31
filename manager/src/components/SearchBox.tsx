import React, { Component } from 'react';

interface SearchBoxProps {
  value: string
  onChange: () => string
}

interface SearchBoxState {
  timeout: any
}

class SearchBox extends Component<SearchBoxProps, SearchBoxState> {
  constructor(props: SearchBoxProps) {
    super(props)

    this.state = {
      timeout: null,
    }
  }

  onChange() {
    if (null !== this.state.timeout) {
      clearTimeout(this.state.timeout);
    }

    this.setState({
      timeout: setTimeout(this.props.onChange, 300)
    })
  }

  render() {
    return (
      <input onChange={this.onChange.bind(this)} type="search" defaultValue={this.props.value} />
    );
  }
}

export default SearchBox;
