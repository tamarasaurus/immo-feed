import { HTMLSource } from '../types/source'

export default class Thierry extends HTMLSource {
    public url = 'https://www.thierry-immobilier.fr/vente/appartement--maison'
    public resultSelector = '.teaser--immobilier'
    public nextPageLink = '.pager-next > a'

    public resultAttributes = [
        { type: 'name', selector: '.teaser__title' },
        { type: 'description', selector: '.teaser__body .dot-ellipsis p' },
        { type: 'size', selector: '.teaser__additional-inner span:nth-child(2)' },
        { type: 'price', selector: '.teaser__price b' },
        { type: 'photo', selector: '.field-type-image img' },
        {
            type: 'link',
            selector: '> a',
            format($: CheerioStatic, link: CheerioStatic) {
                return `https://www.thierry-immobilier.fr${$(link).attr('href')}`;
            }
        }
    ]
}
