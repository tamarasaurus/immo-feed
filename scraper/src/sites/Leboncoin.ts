import Price from '../attributes/Price'
import Text from '../attributes/Text'
import HTMLSite from '../types/HTMLSite'
import Size from '../attributes/Size';
import Link from '../attributes/Link';

export default class Leboncoin extends HTMLSite {
  public itemSelector = 'li[itemtype="http://schema.org/Offer"]'

  public attributes = {
    name: { type: Text, selector: '[itemprop="name"]'},
    price: { type: Price, selector: '[itemprop="price"]'},
    description: { type: Text, selector: '[itemprop="availableAtOrFrom"]'},
    size: { type: Size, selector: '[itemprop="name"]'},
    link: { type: Link, selector: '> a', attribute: 'href'},
    photo: { type: Link, selector: 'img', attribute: 'src'}
  }
}