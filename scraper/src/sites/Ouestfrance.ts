import Price from '../attributes/Price'
import Plaintext from '../attributes/Plaintext'
import HTMLSite from '../types/HTMLSite'
import Size from '../attributes/Size';
import Link from '../attributes/Link';

export default class Ouestfrance extends HTMLSite {
  public itemSelector = '#listAnnonces .annLink'

  public attributes = {
    name: { type: Plaintext, selector: '.annVille' },
    description: { type: Plaintext, selector: '.annTitre' },
    price: { type: Price, selector: '.annPrix' },
    size: { type: Size, selector:  '.annCriteres em.firstCritere:nth-child(1)'},
    link: { type: Link, attribute: 'href' },
    photo: { type: Link, selector: '.annPhoto', attribute: 'data-original'}
  }
}