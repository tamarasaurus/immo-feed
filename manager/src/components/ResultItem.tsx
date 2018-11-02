import React, { Component } from 'react';

interface ResultItemProps {
  data: any
  onPin: (id: string) => any
}

class ResultItem extends Component<ResultItemProps> {
  onPin(event: any) {
    this.props.onPin(this.props.data.id)
  }

  render() {
    const { link, photo, name, createdAt, price, size, description, id } = this.props.data
    return (
      <div key={link} className="result">
        <a href={link}> <img src={photo} /> </a>
        <div className="result-info">
          <span className="column column-full">
            <div className="result-title">{name}</div>
            <div className="result-date">{new Date(`${createdAt}`).toLocaleString()}</div>
            <div className="result-details">€{price.toLocaleString()} | {size}m²</div>
            <div className="result-description">{description}</div>
          </span>
          <span className="result-actions">
            <div onClick={this.onPin.bind(this)} className="result-action good">⚪</div>
            <div className="result-action bad">❌</div>
          </span>
        </div>
      </div>
    );
  }
}

export default ResultItem
