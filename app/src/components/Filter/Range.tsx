import * as React from 'react';

export interface RangeValue {
    start: number;
    end: number;
}

interface RangeProps {
    handleChange: (value: RangeValue) => void;
    value: {
        start: number;
        end: number;
    },
    distribution: number[];
    label: string
}

interface RangeState {
    showBox: boolean;
    value: {
        start: number;
        end: number;
    }
}

export class Range extends React.Component<RangeProps, RangeState> {
    state = {
        showBox: false,
        value: {
            start: 0,
            end: 100,
        }
    }

    render() {
        const className = `filter-button ${this.state.showBox ? 'filter-button--open' : ''}`
        return (
            <div className='filter'>
                <button
                    type='button'
                    className={className}
                    onClick={this.toggleShowBox}
                >
                    {this.props.label}:&nbsp;
                    <span className='filter-value'>
                        €{this.state.value.start} to €{this.state.value.end}
                    </span>
                </button>
                {
                    this.state.showBox &&
                    <div className='filter-box'>
                        <div className='filter-distribution'>
                            {this.props.distribution.map((value: number, index: number) => {
                                return <div key={index} className='filter-bar' style={{ height: value }} />
                            })}
                        </div>
                        <div className='filter-values'>
                            <input
                                name='start'
                                value={this.state.value.start}
                                onChange={this.handleChange}
                                type='number'
                            /> -
                            <input
                                name='end'
                                value={this.state.value.end}
                                onChange={this.handleChange}
                                type='number'
                            />
                        </div>
                        <div
                            onClick={this.toggleShowBox}
                            className='filter-close'
                        >
                            Close
                        </div>
                    </div>
                }
            </div>
        )
    }

    toggleShowBox = () => {
        const showBox = this.state.showBox;
        this.setState({ showBox: !showBox })
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        const range = this.state.value;

        const updatedValue = Object.assign(range, {
            [name]: value ? parseInt(value) : 0
        });

        this.setState({ value: updatedValue });
        this.props.handleChange(updatedValue);
    }
}