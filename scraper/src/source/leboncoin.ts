import { HTMLSource } from '../types/source'

export default class LebonCoin extends HTMLSource {
    public url = 'https://www.leboncoin.fr/ventes_immobilieres/offres/'
    public resultSelector = 'li[itemtype="http://schema.org/Offer"]'
    public nextPageSelector = '.bgMain nav ul li:last-child > a'
    public pagesToScrape = 10

    public resultAttributes = [
        { type: 'name', selector: '[itemprop="name"]' },
        { type: 'description', selector: '[itemprop="availableAtOrFrom"]' },
        { type: 'size', selector: '[itemprop="name"]' },
        { type: 'price', selector: '[itemprop="price"]' },
        {
            type: 'link',
            selector: '> a',
            format($: CheerioStatic, link: CheerioStatic): string {
                return `https://www.leboncoin.fr${$(link).attr('href')}`
            }
        },
        {
            type: 'photo',
            selector: 'img',
            format($: CheerioStatic, photo: CheerioStatic): string {
                return ($(photo).attr('src') || '').replace('-thumb', '-large')
            }
        }
    ]
}
