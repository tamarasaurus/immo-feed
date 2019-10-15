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
  hidden: boolean
}

function ResultList() {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const results: Result[] = await get('/results')
      setResults(results)
    }

    fetchData()
  }, [])

  return <ul className="result-list">
    { results.map((result: any) => {
      const style = { backgroundImage: `url(${result.photo})` }

      return <li key={result.id}>
        <a href={result.link} rel="noopener noreferrer" title="Image" target="_blank" className="result-item-image" style={style}/>
        <div className="result-item-details">
          <div className="result-item-name">{result.name}</div>
          <div className="result-item-created">{new Date(result.created).toLocaleDateString()}</div>
          <div className="result-item-desription">{result.desription}</div>
          <div className="result-item-size">{result.size}</div>
          <div className="result-item-price">{result.price}</div>
        </div>
      </li>
    })}
  </ul>
};

export default ResultList;
