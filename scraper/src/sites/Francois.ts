import Price from '../attributes/Price'
import Text from '../attributes/Text'
import HTMLSite from '../types/HTMLSite'
import Size from '../attributes/Size';
import Link from '../attributes/Link';

export default class Francois extends HTMLSite {
  public itemSelector = '#biens-ls > .row.panel.panel-default'

  public attributes = {
    name: { type: Text, selector: '.panel-body h2' },
    description: { type: Text, selector: '.panel-body .text-justify' },
    size: { type: Size, selector: '.panel-body .text-justify' },
    link: { type: Link, selector: 'a' },
    price: { type: Price, selector: '.panel-body .text-right' },
    photo: { type: Link, selector: '.bien-pic', attribute: 'src'}
  }
}