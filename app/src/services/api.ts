import { ResultData } from '../components/Result';

const API_URL = `http://localhost:8000`;

export function getResults(): Promise<ResultData[]> {
    return fetch(new Request(`${API_URL}/results?page=1`), {
        mode: 'cors',
        method: 'get'
    }).then(response => response.json())
}