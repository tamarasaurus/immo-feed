const data = {
    results: [],
    page: 1,
    pages: null
}

function getResults() {
    const page = getPage()

    return fetch(new Request(`http://localhost:3000/results?page=${page}`), {
        mode: 'cors',
        method: 'get'
    }).then(response => response.json())
}

function hideResult() {
    const id = this.dataset.id

    return fetch(new Request(`http://localhost:3000/results/${id}/hide`), {
        mode: 'cors',
        method: 'post'
    })
    .then(() => {
        const matchingResult = data.results.filter(result => result._id === id)[0]
        matchingResult.hidden = true
        this.parentNode.parentNode.removeChild(this.parentNode)
    })
    .then(() => {
       const displayedResults = data.results.filter(result => !result.hidden)
       if (displayedResults.length === 0) {
           setPage(Math.max(1, getPage() - 1))
           window.location.reload()
       }
    })
}

function getPage() {
    const params = new URLSearchParams(location.search)
    return params.get('page') || 1
}

function setPage(pageNumber) {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('page', pageNumber)
    window.location.search = searchParams.toString()
}

function renderList() {
    new Vue({ el: '#results', data: { results: data.results } })
    new Vue({ el: '.pagination-top', data: { pages: data.pages, page: data.page }})
    new Vue({ el: '.pagination-bottom', data: { pages: data.pages, page: data.page }})

    const hideButtons = Array.from(document.querySelectorAll('.result-hide'))
    hideButtons.forEach(button => button.addEventListener('click', hideResult))
}

getResults().then(response => {
    data.results = response.results.map(result => {
        return result
    })

    data.page = response.page
    data.pages = response.pages

    renderList()
})

document.getElementById('sort').addEventListener('change', function () {
    if (this.value === 'date') {
        return window.location.reload()
    }

    data.results.sort((a, b) => {
        return parseInt(b[this.value]) - parseInt(a[this.value])
    })
})
