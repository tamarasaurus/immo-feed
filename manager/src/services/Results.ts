const url = 'http://localhost:8000/results'

interface FilterParams {
  filter?: string
  page?: number
  minPrice?: string
  maxPrice?: string
  minSize?: string
  maxSize?: string
}

export default {
  fetchPaginated(params: FilterParams) {
    const urlParams = new URLSearchParams()
    Object.entries(params).forEach(param => urlParams.append(...param))
    const queryParams = urlParams.toString()

    return fetch(new Request(`${url}?${queryParams}`), {
      mode: 'cors',
      method: 'get'
    }).then(response => response.json())
  },

  fetchOne(id: string) {

  },

  updateOne(id: string) {

  },

  hide(id: string) {

  },

  see(id: string) {

  },

  pin(id: string) {
    return fetch(`${url}/${id}/pin`,
      { method: 'POST', mode: 'no-cors', }).then(response => response.text())
  }
}
