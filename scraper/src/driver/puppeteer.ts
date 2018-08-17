import * as puppeteer from 'puppeteer'

export default class Puppeteer {
    page: puppeteer.Page
    browser: puppeteer.Browser

    public async launch(): Promise<puppeteer.Browser> {
        return puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          pipe: true
        })
    }

    public async setup(url: string): Promise<puppeteer.Response> {
        this.browser = await this.launch()
        this.page = await this.browser.newPage()
        this.page.setViewport({ width: 1280, height: 1000 })
        return this.goToPage(url)
    }

    public async scrapePage(goNext?: boolean, nextSelector?: string, waitForSelector?: string) {
        await this.scrollDown()
        const nextLink = await this.getElement(nextSelector)

        if (goNext && nextLink) {
            await this.click(nextSelector)
            await this.waitForSelector(waitForSelector)
        }

        await this.scrollDown()
        return this.getPageContent()
    }

    public async goToPage(url: string) {
        return this.page.goto(url)
    }

    public async scrollDown(): Promise<void> {
        await this.page.evaluate(() => { window.scrollBy(0, window.innerHeight) })
    }

    public async getPageContent() {
        return this.page.content()
    }

    public async shutdown() {
        await this.page.close()
        return await this.browser.close()
    }

    public async getElement(selector: string) {
        return this.page.$(selector)
    }

    public async click(selector: string) {
        return this.page.click(selector)
    }

    public async waitForSelector(selector: string, options?: any) {
        return this.page.waitForSelector(selector, options)
    }

    public async url(): Promise<string> {
        return this.page.url()
    }
}
