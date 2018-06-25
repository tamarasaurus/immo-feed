import { HTMLSource } from '../types/source'
import { getPrice } from '../helper/price'

export default class LebonCoin extends HTMLSource {
    public url = 'https://www.leboncoin.fr/ventes_immobilieres/offres/'
    public resultSelector = 'li[itemtype="http://schema.org/Offer"]'

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
            selector: '.LazyLoad',
            format($: CheerioStatic, photo: CheerioStatic): string {
                return ($(photo).attr('content') || '').replace('-thumb', '-large')
            }
        }
    ]
}
