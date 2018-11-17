import Price from '../attributes/Price'
import HTMLSite from '../types/HTMLSite'
import Attribute from '../types/Attribute';

export default class Leboncoin extends HTMLSite {
  public url = 'https://www.leboncoin.fr/ventes_immobilieres/offres/'

  constructor(url: string) {
    super()

    this.url = url
  }

  public itemSelector = 'li[itemtype="http://schema.org/Offer"]'
  public attributes = {
    price: { type: Price, selector: '[itemprop="price"]'}
  }
}