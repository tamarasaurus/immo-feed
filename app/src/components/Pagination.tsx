import React, { Component } from 'react'

const RESULTS_PER_PAGE = 100

interface PaginationProps {
  offset: number
  total: number
  offsetUpdated: (offset: number) => any
}

interface PaginationState {
  offset: number
}

class Pagination extends Component<PaginationProps, PaginationState> {
  constructor(props: PaginationProps) {
    super(props)

    this.state = {
      offset: 0,
    }

    this.goNext = this.goNext.bind(this)
    this.goPrev = this.goPrev.bind(this)
  }

  public goNext() {
    const next = Math.min(this.state.offset + RESULTS_PER_PAGE, this.props.total - RESULTS_PER_PAGE)
    this.setState({ offset: next})
    this.props.offsetUpdated(next)
  }

  public goPrev() {
    const prev = Math.max(0, this.state.offset - RESULTS_PER_PAGE)
    this.setState({ offset: prev })
    this.props.offsetUpdated(prev)
  }

  public getRange() {
    return this.state.offset + RESULTS_PER_PAGE
  }

  public isLastRange() {
    return this.state.offset >= this.props.total
  }

  public componentDidUpdate(props: PaginationProps) {
    if (props.offset !== this.state.offset) {
      this.setState({ offset: props.offset})
    }
  }

  public render() {
    return (
      <div className="pagination">
        <button onClick={this.goPrev}>Previous</button>
        <strong>{this.state.offset} {this.isLastRange() ? '' : '- ' + this.getRange()}  / {this.props.total}</strong>
        <button onClick={this.goNext}>Next</button>
      </div>
    )
  }
}

export default Pagination
