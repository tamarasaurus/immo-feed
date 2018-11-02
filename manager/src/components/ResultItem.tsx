import React, { Component } from 'react';

interface ResultItemProps {
  data: any
  onPin: (id: string) => any
  onUnpin: (id: string) => any
}

interface ResultItemState {
  expanded: boolean
}

class ResultItem extends Component<ResultItemProps, ResultItemState> {
  constructor(props: ResultItemProps) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  onPin(event: any) {
    this.props.onPin(this.props.data.id)
  }

  onUnpin(event: any) {
    this.props.onUnpin(this.props.data.id)
  }

  toggleExpanded() {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const { link, photo, name, createdAt, price, size, description, pinned } = this.props.data
    const style = { 'backgroundImage': `url(${photo})`}
    const trimmedDescription = description.slice(0, 150)
    const trimmed = trimmedDescription.length < description.length

    return (
      <div key={link} className="result">
        <a className="result-link" href={link} style={style}></a>
        <div className="result-info">
          <span className="column column-full">
            <div className="result-title">{name}</div>
            <div className="result-date">{new Date(`${createdAt}`).toLocaleString()}</div>
            <div className="result-details">€{price.toLocaleString()} | {size}m²</div>
            <div className="result-description">
              {
                this.state.expanded ?
                <span>
                  {description} <button title="Collapse" className="result-expand" onClick={this.toggleExpanded.bind(this)}>⇱</button>
                </span> :
                <span>
                  {trimmedDescription}{ trimmed ? <>...<button title="Expand" className="result-expand" onClick={this.toggleExpanded.bind(this)}> ⇲</button></> : ''}
                </span> }
            </div>
          </span>
          <span className="result-actions">
            <div onClick={pinned ? this.onUnpin.bind(this) : this.onPin.bind(this)} className={`result-action good ${pinned ? 'active' : ''}`}>⚪</div>
            <div className="result-action bad">❌</div>
          </span>
        </div>
      </div>
    );
  }
}

export default ResultItem
