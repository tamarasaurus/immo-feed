import { HTMLSource } from '../types/html-source'
import { getSize } from '../helper/size'

export default class Ouestfrance extends HTMLSource {
    public url = 'https://www.ouestfrance-immo.com/acheter/nantes-44-44000/?types=maison,appartement'
    public resultSelector = '#listAnnonces .annLink'
    public nextPageSelector = 'a.suiv'

    public resultAttributes = [
        { type: 'name', selector: '.annVille' },
        { type: 'description', selector: '.annTitre' },
        { type: 'price', selector: '.annPrix' },
        {
            type: 'size',
            selector: '.annCriteres .firstCritere',
            format($: CheerioStatic, element: CheerioElement) {
                return getSize($($(element).get(0)).text().trim())
            }
        },
        {
            type: 'link',
            format($: CheerioStatic, element: CheerioElement): string {
                return `https://www.ouestfrance-immo.com${$(element).attr('href')}`
            }
        },
        {
            type: 'photo',
            selector: '.annPhoto',
            format($: CheerioStatic, photo: CheerioStatic): string {
                return $(photo).data('original')
            }
        }
    ]
}
