import { HTMLSource } from '../types/html-source'

export default class Thierry extends HTMLSource {
    public url = 'https://www.thierry-immobilier.fr/vente/appartement--maison'
    public resultSelector = '.teaser--immobilier'
    public nextPageSelector = '.pager-next > a'

    public resultAttributes = [
        { type: 'name', selector: '.teaser__title' },
        { type: 'description', selector: '.teaser__body .dot-ellipsis p' },
        { type: 'size', selector: '.teaser__additional-inner span:nth-child(2)' },
        { type: 'price', selector: '.teaser__price b' },
        { type: 'photo', selector: '.teaser__cover .field-item img' },
        {
            type: 'link',
            selector: '> a',
            format($: CheerioStatic, link: CheerioStatic) {
                return `https://www.thierry-immobilier.fr${$(link).attr('href')}`
            }
        }
    ]

    public richAttributes = [
        {
            type: 'photos',
            selector: '.slick-track img',
            format($: CheerioStatic, photos: CheerioStatic) {
                const photoUrls = $(photos).map((index: number, photo: CheerioElement) => {
                    return $(photo).attr('src').replace('styles/medium/public/', '')
                }).get()

                return photoUrls.filter((photo: string, index: number) => photoUrls.indexOf(photo) !== index)
            }
        }
    ]
}
