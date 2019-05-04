import * as React from 'react';
import { debounce } from 'lodash';
import { RouteComponentProps } from '@reach/router';
import Search from './components/Filter/Search';

interface ResultsState {
    value: string;
}

export default class Results extends React.Component<RouteComponentProps, ResultsState> {
    state = {
        value: ''
    }


    public validate = (value: string) => {
        console.log('after debounce', value)
    }

    public debounceValidate = debounce(this.validate, 500);

    render() {
        return (<div>
            <h1>Results</h1>

            <Search
                onChange={this.handleChange}
                value={this.state.value}
            />
        </div>)
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        this.setState({ value })
        this.debounceValidate(value);
    }
}