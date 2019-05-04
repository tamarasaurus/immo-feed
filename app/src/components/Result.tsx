import * as React from 'react';

export interface ResultData {
    name: string;
    description: string;
    size: number;
    link: string;
    price: number;
    photo: string;
    id: string;
    created: string;
    updated: string;
}

interface ResultProps {
    data: ResultData
}

export class Result extends React.Component<ResultProps> {
    render() {
        const {
            name,
            photo,
            link,
            description,
            size,
            price
        } = this.props.data;

        return (
        <div className='result'>
            <a href={link} target='_blank' className='result-photo' style={{backgroundImage: `url('${photo}')`}} />
            <a href={link} target='_blank' className='result-name'>{name}</a>
            <div className='result-description'>{description}</div>
            <div className='result-details'>
                <span>{size.toLocaleString()}m²</span>
                <span>€{price.toLocaleString()}</span>
            </div>
        </div>
        )
    }
}