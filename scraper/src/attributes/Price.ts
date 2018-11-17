export default class Price {
  private value: number = null

  public constructor(price: string) {
    if (price === undefined || price === null) {
      return null
    }

    this.value = this.normalize(price)
  }

  private normalize(price: string): number {
    const strippedString = price.replace(/\s+/g, '');
    const getValue = /(\d+)|(\D+)/gm
    const parsedString = strippedString.match(getValue)
    return parseInt(parsedString[0]) || 0
  }

  public getValue(): number {
    return this.value
  }
}