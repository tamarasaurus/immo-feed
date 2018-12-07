export default class Text {
  private value: string = null

  public constructor(value: string) {
    if (value === undefined || value === null || value.trim().length === 0) {
      return null
    }

    this.value = this.normalize(value)
  }

  public getValue(): string {
    return this.value
  }

  public normalize(value: string): string {
    return value.trim()
  }
}
