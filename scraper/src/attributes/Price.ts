type NormalizedPrice = {
  number: number
  currency: string
}

export default class Price {
  private number: number
  private currency: string

  public constructor(price: string) {
    if (price === undefined || price === null) {
      return null
    }

    const normalizedPrice = this.normalize(price)

    if (normalizedPrice === null) {
      return null
    }

    this.number = normalizedPrice.number
    this.currency = normalizedPrice.currency
  }

  private normalize(price: string): NormalizedPrice {
    const strippedString = price.replace(/\s+/g, '');
    const getnumber = /(\d+)|(\D+)/gm
    const parsedString = strippedString.match(getnumber)

    if (parsedString === null) {
      return null
    }

    const number = parseInt(parsedString[0])
    const currency = parsedString[1] || '€'

    return {
      number,
      currency
    }
  }

  public getValue(): NormalizedPrice {
    return {
      number: this.getNumber(),
      currency: this.getCurrency()
    }
  }

  public getNumber(): number {
    return this.number
  }

  public getCurrency(): string {
    return this.currency
  }
}