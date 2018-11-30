import React, { Component } from 'react'

interface PinnedResultProps {
    result: any
    unpinResult: (result: any) => any
}

class PinnedResult extends Component<PinnedResultProps> {
  public render() {
    const { id, link, name, created, description, photo, size, price } = this.props.result

    return <li
        className="list-item"
        id={id}>
            <a href={link} target="_blank" className="list-item-photo" style={{backgroundImage: `url('${photo}')`}}></a>
            <div className="list-item-details">
                <div className="list-item-name">{name}</div>
                <div className="list-item-date">{new Date(created).toLocaleDateString()} {new Date(created).toLocaleTimeString()}</div>
                <div className="list-item-description">{description}</div>
            </div>
        <div className="list-item-data">
            {size > 0 ? <span className="pill">{size}m²</span> : ''}
            {price > 0 ? <span className="pill">€{price.toLocaleString()}</span> : ''}
        </div>
        <div className="list-item-actions">
            <button onClick={this.props.unpinResult.bind(this, this.props.result)} className="action hover"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#ccc" d="M16 4.588l2.833 8.719H28l-7.416 5.387 2.832 8.719L16 22.023l-7.417 5.389 2.833-8.719L4 13.307h9.167L16 4.588z"/></svg></button>
            <button className="action"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#ccc" d="M16 5C9.935 5 5 9.934 5 16c0 6.067 4.935 11 11 11s11-4.933 11-11c0-6.066-4.935-11-11-11zm0 2.75c1.777 0 3.427.569 4.775 1.53L9.279 20.778A8.214 8.214 0 0 1 7.75 16c0-4.549 3.701-8.25 8.25-8.25zm0 16.5a8.2 8.2 0 0 1-4.775-1.53l11.494-11.497A8.205 8.205 0 0 1 24.25 16c0 4.547-3.701 8.25-8.25 8.25z"/></svg></button>
        </div>
    </li>
  }
}

export default PinnedResult
