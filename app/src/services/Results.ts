const url = 'http://localhost:8000'

interface FilterParams {
  filter?: string
  page?: number
  minPrice?: string
  maxPrice?: string
  minSize?: string
  maxSize?: string
  pinned?: boolean
}

const Results = {
  fetchAll(params: FilterParams, page: number) {
    const urlParams = new URLSearchParams()
    Object.entries(params).forEach(param => urlParams.append(...param))
    const queryParams = urlParams.toString()

    return fetch(new Request(`${url}/results?${queryParams}`), {
      mode: 'cors',
      method: 'get',
      headers: {
        'Prefer': 'count=exact'
      }
    }).then(async (response) => {
      return [await response.json(), response.headers.get('Content-Range')]
    }).then(([json, contentRange]) => {
      const total = parseInt(contentRange.split('/')[1])
      const data = {
        results: json,
        page: page,
        pages: Math.ceil(total / 10),
        total: total,
        filters: {
          price: { min: 0, max: 123 },
          size: { min: 0, max: 456}
        }
      }
      return data
    })
  },

  fetchPinned() {
    return fetch(new Request(`${url}/results?pinned=is.true`), {
      mode: 'cors',
      method: 'get'
    }).then(response => response.json())
  },

  hide(id: string) {
    return fetch(`${url}/results/${id}/hide`,
      { method: 'POST', mode: 'no-cors', }).then(response => response.text())
  },

  see(id: string) {
    return fetch(`${url}/results/${id}/see`,
      { method: 'POST', mode: 'no-cors', }).then(response => response.text())
  },

  pin(id: string) {
    return fetch(`${url}/results/${id}/pin`,
      { method: 'POST', mode: 'no-cors', }).then(response => response.text())
  },

  unpin(id: string) {
    return fetch(`${url}/results/${id}/unpin`,
      { method: 'POST', mode: 'no-cors', }).then(response => response.text())
  }
}

export default Results