const data = {
    results: []
}

function getResults() {
    return fetch(new Request('http://localhost:3000/results'), {
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

getResults().then(results => {
    data.results = results
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

