import * as React from 'react';
import { debounce } from 'lodash';
import { RouteComponentProps } from '@reach/router';
import Search from './Filter/Search';
import { RangeValue, Range } from './Filter/Range';
import { ResultData, Result } from './Result';
import { getResults, ResultFilters } from '../services/api'

const RESULT_LIMIT = 100;

interface ResultsState {
    searchValue: string;
    priceRange: RangeValue;
    priceDistribution: number[];
    sizeRange: RangeValue;
    sizeDistribution: number[];
    results: ResultData[];
    offset: number;
    filters: ResultFilters;
}

export default class Results extends React.Component<RouteComponentProps, ResultsState> {
    state: ResultsState = {
        searchValue: '',
        priceRange: {
            start: 0,
            end: 100,
        },
        priceDistribution: [
            5, 10, 20, 30, 45, 48, 50, 30, 20, 10,
            5, 10, 20, 30, 45, 48, 50, 30, 20, 10,
            5, 10, 20, 30, 45, 48, 50, 30, 20, 10,
        ],
        sizeRange: {
            start: 0,
            end: 100,
        },
        sizeDistribution: [
            5, 10, 20, 30, 45, 48, 50, 30, 20, 10,
            5, 10, 20, 30, 45, 48, 50, 30, 20, 10,
            5, 10, 20, 30, 45, 48, 50, 30, 20, 10,
        ],
        results: [],
        offset: 0,
        filters: {
            min_size: 0,
            max_size: 0,
            min_price: 0,
            max_price: 0,
            total: '500'
        }
    }

    public validate = (searchValue: string) => {
        console.log('load results', searchValue)
    }

    public debounceValidate = debounce(this.validate, 500);

    render() {
        return (
            <div>
                <form>
                    <Search
                        onChange={this.handleSearchChange}
                        value={this.state.searchValue}
                    />
                    <div className='filters'>
                        <Range
                            distribution={this.state.priceDistribution}
                            label='Price'
                            value={this.state.priceRange}
                            handleChange={this.handlePriceChange}
                        />
                        <Range
                            distribution={this.state.sizeDistribution}
                            label='Size'
                            value={this.state.sizeRange}
                            handleChange={this.handleSizeChange}
                        />
                        <div className='pagination'>
                            <div className='pagination-page'>{this.state.offset}</div>
                            <button
                                type='button'
                                className='pagination-button'
                                onClick={this.goNext}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    <div className='results'>
                        {this.state.results.map((result: ResultData) => {
                            return <Result key={result.id} data={result} />
                        })}
                    </div>
                </form>

            </div>
        )
    }

    handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        this.setState({ searchValue: value })
        this.debounceValidate(value);
    }

    handlePriceChange = (value: RangeValue): void => {
        console.log('price range', value)
    }

    handleSizeChange = (value: RangeValue): void => {
        console.log('price range', value)
    }

    fetchResults = (): void => {
        getResults(this.state.offset).then((results: ResultData[]) => {
            this.setState({ results })
        })
    }

    componentDidMount() {
        this.fetchResults();
    }

    goNext = () => {
        const { offset } = this.state;
        const nextOffset = (offset + RESULT_LIMIT)
        this.setState({ offset: nextOffset}, this.fetchResults);
    }
}