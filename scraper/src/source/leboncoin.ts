import { HTMLSource } from '../types/source'
import { getPrice } from '../helper/price'

export default class LebonCoin extends HTMLSource {
    public url = 'https://www.leboncoin.fr/ventes_immobilieres/offres/'
    public resultSelector = 'li[itemtype="http://schema.org/Offer"]'

    public resultAttributes = [
        { type: 'name', selector: '.item_title' },
        { type: 'description', selector: '.ispro' },
        { type: 'size', selector: '.item_title' },
        { type: 'link', selector: '> a' },
        {
            type: 'price',
            selector: '.item_price',
            format($: CheerioStatic, price: CheerioStatic) {
                return getPrice($(price).attr('content') || '0')
            }
        },
        {
            type: 'photo',
            selector: '[itemprop="image"]',
            format($: CheerioStatic, photo: CheerioStatic): string {
                return $(photo).data('imgsrc')
            }
        }
    ]
}
