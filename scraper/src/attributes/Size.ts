type NormalizedSize = {
  number: number
  measurement: string
}

export default class Size {
  private number: number
  private measurement: string

  public constructor(size: string) {
    if (size === undefined || size === null) {
      return null
    }

    const normalizedSize = this.normalize(size)
    this.number = normalizedSize.number
    this.measurement = normalizedSize.measurement
  }

  private normalize(size: string): NormalizedSize {
    const sizeNumber = parseInt(size)
    let parsedSize: number = sizeNumber

    if (Number.isNaN(parsedSize)) {
        const regex = /^\d+|(\b\d+\s+|\d)+\s?(?=m2|M²|m²|m\s)/gm;
        const match = regex.exec(size)
        parsedSize = match && match[0] ? parseInt(match[0].replace(/\D/gm, '')) : 0
    }

    const number = parsedSize
    const measurement = 'm²'

    return {
      number,
      measurement
    }
  }

  public getValue(): NormalizedSize {
    return {
      number: this.getNumber(),
      measurement: this.getMeasurement()
    }
  }

  public getNumber(): number {
    return this.number
  }

  public getMeasurement(): string {
    return this.measurement
  }
}