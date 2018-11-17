import Price from '../attributes/Price'
import HTMLSite from '../types/HTMLSite'

export default class Leboncoin extends HTMLSite {
  constructor(url: string) {
    super()

    this.url = url
  }

  public itemSelector = 'li[itemtype="http://schema.org/Offer"]'

  public attributes = {
    price: { type: Price, selector: '[itemprop="price"]'}
  }
}