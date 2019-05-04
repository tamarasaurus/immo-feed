import * as React from 'react';

interface SearchProps {
  value: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void
}

export default class Search extends React.Component<SearchProps> {
  render() {
    return (
      <input
        className='search'
        type='search'
        value={this.props.value}
        placeholder='🔍 Search in name, description and URL'
        onChange={this.props.onChange}
      />
    );
  }
}
