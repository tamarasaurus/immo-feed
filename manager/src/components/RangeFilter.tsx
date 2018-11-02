import React, { Component } from 'react'
import { clone } from 'lodash'

interface RangeFilterProps {
  label: string
  min: number
  max: number
  onChange: (min: number, max: number) => any
}

interface RangeFilterState {
  min: number
  max: number
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
    this.setState({min: parseInt(event.target.value)})
    this.triggerChange()
  }

  handleMaxChange(event: any) {
    this.setState({max: parseInt(event.target.value) })
    this.triggerChange()
  }

  triggerChange() {
    const { min, max } = this.state
    this.props.onChange(min, max)
  }

  render() {
    return <div className="filter-item">
      <span className="filter-name">{this.props.label}</span>
      <span className="filter-info">between
        <input onChange={this.handleMinChange.bind(this)} min={1}  value={this.state.min} type="number"/> and
        <input onChange={this.handleMaxChange.bind(this)} min={1} value={this.state.max} type="number"/></span>
    </div>
  }
}

export default RangeFilter
