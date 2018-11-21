export default class Text {
  private value: string = null

  public constructor(value: string) {
    if (value === undefined || value === null || value.trim().length === 0) {
      return null
    }

    this.value = this.normalize(value)
  }

  private normalize(value: string): string {
    return value.trim()
  }

  public getValue(): string {
    return this.value
  }
}