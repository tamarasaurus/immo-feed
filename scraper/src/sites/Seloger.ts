import Price from '../attributes/Price'
import Text from '../attributes/Text'
import HTMLSite from '../types/HTMLSite'
import Size from '../attributes/Size';
import Link from '../attributes/Link';

export default class Seloger extends HTMLSite {
  public itemSelector = '[data-listing-id]'

  public attributes = {
    name: { type: Text, selector: '.c-pa-link'},
    description: { type: Text, selector: '.c-pa-city'},
    price: { type: Price, selector: '.c-pa-price'},
    size: { type: Size, selector: '.c-pa-criterion em:nth-child(3)'},
    link: { type: Link, selector: '.c-pa-link', attribute: 'href'}
  }
}