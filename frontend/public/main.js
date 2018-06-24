function getResults() {
    return fetch(new Request('http://localhost:3000/results'), {
        mode: 'cors',
        method: 'get'
    })
    .then(response => response.json())
}

function renderList(results) {
    new Vue({ el: "#results", data: { results } });
}

getResults().then(renderList)
