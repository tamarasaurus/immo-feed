import { ResultData } from '../components/Result';

const API_URL = `http://localhost:8000`;

export function getResults(offset: number): Promise<ResultData[]> {
    return fetch(new Request(`${API_URL}/results?offset=${offset}`), {
        mode: 'cors',
        method: 'get'
    }).then(response => response.json())
}

export interface ResultFilters {
    min_size: number;
    max_size: number;
    min_price: number;
    max_price: number;
    total: string;
}

export function getFilters(): Promise<ResultFilters> {
    return fetch(new Request(`${API_URL}/filters`), {
        mode: 'cors',
        method: 'get'
    }).then(response => response.json())
}