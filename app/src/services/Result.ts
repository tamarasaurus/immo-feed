export function getAll(offset: number) {
  return fetch(new Request(`http://localhost:8000/results?offset=${offset}`), {
    mode: 'cors',
    method: 'get',
  }).then(response => response.json())
}

export function getPinned() {
  return fetch(new Request('http://localhost:8000/pinned'), {
    mode: 'cors',
    method: 'get',
  }).then(response => response.json())
}

export function getFilters() {
  return fetch(new Request('http://localhost:8000/filters'), {
    mode: 'cors',
    method: 'get',
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
