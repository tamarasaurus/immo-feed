export class Source {
    public url: string = null
    public resultAttributes: any[] = []
    public richAttributes: any[] = []
    public resultSelector: string = null
    public scraperName = this.constructor.name.toLocaleLowerCase()
}
