import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark as bookmarkRegular } from '@fortawesome/free-regular-svg-icons'
import { faBookmark as bookmarkSolid } from '@fortawesome/free-solid-svg-icons'

interface ResultItemProps {
  data: any
  onPin: (id: string) => any
  onUnpin: (id: string) => any
  onHide: (id: string) => any
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

  onHide() {
    this.props.onHide(this.props.data.id)
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
            <div className="result-title">
              {name}
              <div className="result-date">{new Date(`${createdAt}`).toLocaleString()}</div>
              <div className="result-details">€{price.toLocaleString()} | {size}m²</div>
            </div>
            <div className="result-description">
              {
                this.state.expanded ?
                <span>{description}<button title="Collapse" className="result-expand" onClick={this.toggleExpanded.bind(this)}>less</button>
                </span> :
                <span>{trimmedDescription}{ trimmed ? <>...<button title="Expand" className="result-expand" onClick={this.toggleExpanded.bind(this)}>more</button></> : ''}
                </span>}
            </div>
            <span className="result-actions">
              <div onClick={pinned ? this.onUnpin.bind(this) : this.onPin.bind(this)} className={`result-action good ${pinned ? 'active' : ''}`}>
                {pinned ? <FontAwesomeIcon icon={bookmarkSolid} /> : <FontAwesomeIcon icon={bookmarkRegular} />}
              </div>
              <div onClick={this.onHide.bind(this)} className="result-action bad">❌</div>
            </span>
        </div>
      </div>
    );
  }
}

export default ResultItem
