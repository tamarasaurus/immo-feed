import * as puppeteer from 'puppeteer'
import * as randomUserAgent from 'random-useragent';

export default class Puppeteer {
    page: puppeteer.Page
    browser: puppeteer.Browser

    public async launch(): Promise<puppeteer.Browser> {
        console.log('Launch puppeteer with chromium browser')
        return puppeteer.launch({
          executablePath:
           '/usr/bin/chromium-browser',
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox",'--disable-dev-shm-usage'],
          ignoreHTTPSErrors: true
        })
    }

    public async setup(url: string): Promise<puppeteer.Response> {
        this.browser = await this.launch()
        this.page = await this.browser.newPage()
        this.page.setViewport({ width: 1280, height: 1000 })
        this.page.setExtraHTTPHeaders({
            'Accept': 'text/html',
            'Accept-Language': 'fr-FR',
            'Accept-Encoding': 'gzip'
        })
        this.page.setUserAgent(randomUserAgent.getRandom());

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

    public async takeScreenshot() {
        return await this.page.screenshot({path: './debug/screenshot.png',
            clip: {x: 0, y:0, width: 1280, height: 1000}
        })
    }

    public async click(selector: string) {
        try {
            return await this.page.click(selector)
        } catch (e) {
            throw Error(`Cannot click on ${selector}`)
        }
    }

    public async waitForSelector(selector: string, options?: any) {
        return this.page.waitForSelector(selector, options)
    }

    public async url(): Promise<string> {
        return this.page.url()
    }
}
