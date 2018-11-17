export default class Size {
  private value: number = null

  public constructor(size: string) {
    if (size === undefined || size === null) {
      return null
    }

    this.value = this.normalize(size)
  }

  private normalize(size: string): number {
    const sizeNumber = parseInt(size)
    let parsedSize: number = sizeNumber

    if (Number.isNaN(parsedSize)) {
        const regex = /^\d+|(\b\d+\s+|\d)+\s?(?=m2|M²|m²|m\s)/gm;
        const match = regex.exec(size)
        parsedSize = match && match[0] ? parseInt(match[0].replace(/\D/gm, '')) : 0
    }

    return parsedSize
  }

  public getValue(): number {
    return this.value
  }
}