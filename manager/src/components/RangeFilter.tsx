import React, { Component } from 'react'
import { clone } from 'lodash'

interface RangeFilterProps {
  label: string
  min: string
  max: string
  onChange: (min: string, max: string) => any
}

interface RangeFilterState {
  min: string
  max: string
}

class RangeFilter extends Component<RangeFilterProps, RangeFilterState> {
  constructor(props: RangeFilterProps) {
    super(props)

    this.state = {
      min: clone(this.props.min),
      max: clone(this.props.max)
    }
  }

  handleMinChange(event: any) {
    const value = event.target.value
    if (value) {
      this.setState({min: event.target.value })
      this.triggerChange()
    }
  }

  handleMaxChange(event: any) {
    const value = event.target.value
    if (value) {
      this.setState({ max: event.target.value })
      this.triggerChange()
    }
  }

  triggerChange() {
    const { min, max } = this.state
    this.props.onChange(min, max)
  }

  render() {
    return <div className="filter-item">
      <span className="filter-name">{this.props.label}</span>
      <span className="filter-info">between
        <input onChange={this.handleMinChange.bind(this)} value={this.state.min} type="number"/> and
        <input onChange={this.handleMaxChange.bind(this)} value={this.state.max} type="number"/></span>
    </div>
  }
}

export default RangeFilter
