import Price from '../attributes/Price'
import Text from '../attributes/Text'
import HTMLSite from '../types/HTMLSite'
import Size from '../attributes/Size';
import Link from '../attributes/Link';

export default class Thierry extends HTMLSite {
  public itemSelector = '.teaser--immobilier'

  public attributes = {
    name: { type: Text, selector: '.teaser__title' },
    description: { type: Text, selector: '.teaser__body .dot-ellipsis p' },
    size: { type: Size, selector: '.teaser__additional-inner span:nth-child(2)' },
    price: { type: Price, selector: '.teaser__price b'},
    photo: { type: Link, selector: '.teaser__cover .field-type-image img', attribute: 'src'},
    link: { type: Link, selector: '> a', attribute: 'href'}
  }
}