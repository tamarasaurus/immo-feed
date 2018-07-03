const data = {
    results: [],
    page: 1,
    pages: null
}

function getResults() {
    const params = new URLSearchParams(location.search)
    const page = params.get('page') || 1
    return fetch(new Request(`http://localhost:3000/results?page=${page}`), {
        mode: 'cors',
        method: 'get'
    }).then(response => response.json())
}

function hideResult() {
    return fetch(new Request(`http://localhost:3000/results/${this.dataset.id}/hide`), {
        mode: 'cors',
        method: 'post'
    }).then(() => this.parentNode.parentNode.removeChild(this.parentNode))
}

function renderList() {
    new Vue({ el: '#results', data: { results: data.results } })

    const hideButtons = Array.from(document.querySelectorAll('.result-hide'))
    hideButtons.forEach(button => button.addEventListener('click', hideResult))
}

getResults().then(response => {
    data.results = response.results
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

