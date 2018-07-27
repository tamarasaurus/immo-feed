import { HTMLSource } from '../types/html-source'
import { getFromBackgroundImage } from '../helper/photo';

export default class LebonCoin extends HTMLSource {
    public url = 'https://www.leboncoin.fr/ventes_immobilieres/offres/'
    public resultSelector = 'li[itemtype="http://schema.org/Offer"]'
    public nextPageSelector = '.bgMain nav ul li:last-child > a'
    public pagesToScrape = 1

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
            type: 'photos',
            selector: 'img',
            format($: CheerioStatic, photo: CheerioStatic): string[] {
                return [($(photo).attr('src') || '').replace('-thumb', '-large')]
            }
        }
    ]

    public richAttributes = [
        {
            type: 'photos',
            selector: '[data-qa-id="slideshow_container"]',
            wait: true,
            format($: CheerioStatic, photos: CheerioStatic): string[] {
                const urls: string[] = []

                $('[data-qa-id="slideshow_thumbnails_item"]', $(photos)).each((index, photo) => {
                    const style = $('div', photo).attr('style')
                    const url = getFromBackgroundImage(style)
                    if (url) urls.push(url)
                })

                return urls
            }
        }
    ]
}
