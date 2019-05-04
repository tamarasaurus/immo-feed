import * as React from 'react';
import { debounce } from 'lodash';
import { RouteComponentProps } from '@reach/router';
import Search from './components/Filter/Search';
import { RangeValue, Range } from './components/Filter/Range';

interface ResultsState {
    searchValue: string;
    priceRange: RangeValue;
    priceDistribution: number[];
}

export default class Results extends React.Component<RouteComponentProps, ResultsState> {
    state = {
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
        ]
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
}