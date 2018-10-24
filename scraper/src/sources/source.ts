export class Source {
    public url: string = null
    public resultAttributes: any[] = []
    public resultSelector: string = null
    public sourceName = this.constructor.name.toLocaleLowerCase()
}
