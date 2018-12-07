export function getAll(offset: number, search: string, { min, max }: { min: number, max: number }) {
  const priceDefined = (min !== undefined && max !== undefined )
  const priceFilter = priceDefined ? `&min_price=${min}&max_price=${max}` : ''
  return fetch(new Request(`http://localhost:8000/results?offset=${offset}&search=${search}${priceFilter}`), {
    mode: 'cors',
    method: 'get',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  }).then(response => response.json())
}

export function getPinned() {
  return fetch(new Request('http://localhost:8000/pinned'), {
    mode: 'cors',
    method: 'get',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  }).then(response => response.json())
}

export function getFilters() {
  return fetch(new Request('http://localhost:8000/filters'), {
    mode: 'cors',
    method: 'get',
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  }).then(response => response.json())
}

export function saveResult(result: any) {
  return fetch(new Request(`http://localhost:8000/results/${result.id}`), {
    mode: 'cors',
    method: 'put',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(result),
  }).then(response => response.ok)
}
