type NormalizedPrice = {
  value: number
  currency: string
}

export default class Price {
  private value: number
  private currency: string

  public constructor(price: string) {
    if (price === undefined || price === null) {
      return null
    }

    const normalizedPrice = this.normalize(price)
    this.value = normalizedPrice.value
    this.currency = normalizedPrice.currency
  }

  private normalize(price: string): NormalizedPrice {
    const strippedString = price.replace(/\s+/g, '');
    const getValue = /(\d+)|(\D+)/gm
    const parsedString = strippedString.match(getValue)

    if (parsedString === null) {
      return null
    }

    const value = parseInt(parsedString[0])
    const currency = parsedString[1] || '€'

    return {
      value,
      currency
    }
  }

  public getValue(): number {
    return this.value
  }

  public getCurrency(): string {
    return this.currency
  }
}