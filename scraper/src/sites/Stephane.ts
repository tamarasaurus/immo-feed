import Price from '../attributes/Price'
import Text from '../attributes/Text'
import HTMLSite from '../types/HTMLSite'
import Size from '../attributes/Size';
import Link from '../attributes/Link';
import BackgroundImage from '../attributes/BackgroundImage';

export default class Stephane extends HTMLSite {
  public itemSelector = '[data-product-id]'

  public attributes = {
    name: { type: Text, selector: '.item-products_pieces'},
    description: { type: Text, selector: '.item-products_address'},
    price: { type: Price, selector: '.item-products_price'},
    size: { type: Size, selector: '.item-products_pieces'},
    link: { type: Link, attribute: 'data-url'},
    photo: { type: BackgroundImage, selector: '.slides-image.webresize', attribute: 'style'}
  }
}