const data = {
    results: []
}

function getResults() {
    return fetch(new Request('http://localhost:3000/results'), {
        mode: 'cors',
        method: 'get'
    })
    .then(response => response.json())
}

function renderList() {
    new Vue({ el: '#results', data: { results: data.results } });
}

getResults().then(results => {
    data.results = results
    renderList()
})

document.getElementById('sort').addEventListener('change', function () {
    switch (this.value) {
        case 'date':
            window.location.reload()
        default:
            data.results.sort((a, b) => {
                return parseInt(b[this.value]) - parseInt(a[this.value])
            })

            break;
    }
});
