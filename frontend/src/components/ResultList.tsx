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
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const results = await get('/results')
      setResults(results)
    }

    fetchData()
  }, [])

  return <ul>
    { results.map((result: any) => {
      return <li key={result.id}>
        <img src={result.photo}/>


      </li>
    })}
  </ul>
};

export default ResultList;
