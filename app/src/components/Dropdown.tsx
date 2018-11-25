import React, { Component } from 'react'

const RESULTS_PER_PAGE = 100

interface DropdownProps {
  label: string
}

interface DropdownState {
  open: boolean
}

class Dropdown extends Component<DropdownProps, DropdownState> {
  constructor(props: DropdownProps) {
    super(props)

    this.state = {
      open: false,
    }
  }

  public toggleOpen() {
    this.setState({ open: !this.state.open })
  }

  public render() {
    return (
      <div className="dropdown">
        <button onClick={this.toggleOpen.bind(this)}>{this.props.label}</button>

        <div className={this.state.open ? 'dropdown-children open' : 'dropdown-children'}>
          {this.state.open ?
            <>{this.props.children}</>
            : ''
          }
        </div>
      </div>
    )
  }
}

export default Dropdown
