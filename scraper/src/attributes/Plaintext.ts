export default class Plaintext {
  private text: string

  public constructor(text: string) {
    if (text === undefined || text === null) {
      return null
    }

    this.text = this.normalize(text)
  }

  private normalize(text: string): string {
    return text.trim()
  }

  public getValue(): string {
    return this.text
  }
}