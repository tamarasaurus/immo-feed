import Price from '../attributes/Price'
import Plaintext from '../attributes/Plaintext'
import HTMLSite from '../types/HTMLSite'
import Size from '../attributes/Size';
import Link from '../attributes/Link';

export default class Francois extends HTMLSite {
  public itemSelector = '#biens-ls > .row.panel.panel-default'

  public attributes = {
    name: { type: Plaintext, selector: '.panel-body h2' },
    description: { type: Plaintext, selector: '.panel-body .text-justify' },
    size: { type: Size, selector: '.panel-body .text-justify' },
    link: { type: Link, selector: 'a' },
    price: { type: Price, selector: '.panel-body .text-right' },
    photo: { type: Link, selector: '.bien-pic', attribute: 'src'}
  }
}