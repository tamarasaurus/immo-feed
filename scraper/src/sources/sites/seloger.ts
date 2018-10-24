import { HTMLSource } from '../html-source'
import { getSize } from '../../helper/size'
import { getFromBackgroundImage } from '../../helper/photo';

export default class Seloger extends HTMLSource {
    public url = 'https://www.seloger.com/list.htm?types=1,2&projects=2,5&natures=1,2,4&qsVersion=1.0'
    public resultSelector = '[data-listing-id]'
    public nextPageSelector = '.pagination-next'

    public resultAttributes = [
        { type: 'name', selector: '.c-pa-link' },
        { type: 'description', selector: '.c-pa-city' },
        { type: 'price', selector: '.c-pa-price' },
        { type: 'link', selector: '.c-pa-link' },
        {
            type: 'size',
            selector: '.c-pa-criterion',
            format($: CheerioStatic, size: CheerioStatic): string {
                const sizeContent = $($("em:contains('m')", $(size))).text()
                return getSize(sizeContent)
            }
        },
        {
            type: 'photo',
            selector: '[data-lazy]',
            format($: CheerioStatic, photo: CheerioStatic): string[] {
                let url = $(photo).data('lazy').url

                if (url) {
                    url.replace('310x255', '1280x800')
                    return url
                }

                return null
            }
        }
    ]
}
