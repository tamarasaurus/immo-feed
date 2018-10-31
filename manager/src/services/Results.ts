const url = 'http://localhost:8000/results'

export default {
    fetchPaginated({ filter = '', page = 1}) {
        return fetch(new Request(`${url}?page=${page}&filter=${filter}`), {
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

    }
}
