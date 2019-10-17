import React from 'react';

export interface Result {
  name: string
  description: string
  size: number
  price: string
  link: string
  created: string
  updated: string
  photo: string
  id: string
  total: string;
}


interface ResultListProps {
  results: Result[]
}

function ResultList({results }: ResultListProps) {
  return <ul className="result-list">
    { results.map((result: Result) => {
      const style = { backgroundImage: `url(${result.photo})` }

      return <li key={result.id}>
        <a href={result.link} rel="noopener noreferrer" title="Image" target="_blank" className="result-item-image" style={style}></a>
        <div className="result-item-details">
          <div className="result-item-name">{result.name}</div>
          <div className="result-item-created">{new Date(result.created).toLocaleDateString()}</div>
          <div className="result-item-description">{result.description}</div>
        </div>
        <div className="result-item-summary">
          <div className="result-item-size">{result.size}m²</div>
          <div className="result-item-price">{parseInt(result.price).toLocaleString()}€</div>
        </div>
      </li>
    })}
  </ul>
};

export default ResultList;
