import React, { useState, useEffect } from 'react';
import { get } from '../api'

interface Result {
  name: string
  description: string
  size: number
  price: number
  link: string
  created: string
  updated: string
  photo: string
}

interface ResultListProps {
  filter: string
  search: string
}

function ResultList({ filter, search }: ResultListProps) {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const results: Result[] = await get(`/results?filter=${filter}&search=${search}`)
      setResults(results)
    }

    fetchData()
  }, [filter, search])

  return <ul className="result-list">
    { results.map((result: any) => {
      const style = { backgroundImage: `url(${result.photo})` }

      return <li key={result.id}>
        <a href={result.link} rel="noopener noreferrer" title="Image" target="_blank" className="result-item-image" style={style}/>
        <div className="result-item-details">
          <div className="result-item-name">{result.name}</div>
          <div className="result-item-created">{new Date(result.created).toLocaleDateString()}</div>
          <div className="result-item-desription">{result.desription}</div>
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
