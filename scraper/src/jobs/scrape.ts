import { Job, DoneCallback } from 'bull'
import ScrapedItem from '../types/ScrapedItem'
import * as request from 'request-promise'
import * as randomUserAgent from 'random-useragent'
import HTMLSite from '../types/HTMLSite'
import * as puppeteer from 'puppeteer'

async function getPageContentsWithFullLoad(url: string, userAgent: string): Promise<string> {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-insecure'],
    ignoreHTTPSErrors: true,
  })

  const page = await browser.newPage()
  await page.setUserAgent(userAgent)
  await page.setExtraHTTPHeaders({
    'Accept': 'text/html',
    'Accept-Language': 'fr-FR',
  })
  await page.setViewport({ width: 1280, height: 1000 })
  await page.goto(url)
  const contents = await page.content()
  await page.close()
  await browser.close()

  return contents
}

async function getPageContentsWithRequest(url: string, userAgent: string): Promise<string> {
  return await request.get({
    url,
    gzip: true,
    proxy: null,
    headers: {
      'Accept': 'text/html',
      'Accept-Language': 'fr-FR',
      'User-Agent': userAgent,
    },
  })
}

module.exports = function(job: Job, done: DoneCallback) {
    try {
      const { url, contract } = job.data
      const userAgent = randomUserAgent.getRandom()
      const getMethod = (contract.load === true) ? getPageContentsWithFullLoad : getPageContentsWithRequest
      return getMethod(url, userAgent)
        .then((contents: string) => {
          const page = new HTMLSite(contract, url, contents)
          return page.getMappedItems()
        })
        .then((results: ScrapedItem[]) => done(null, results))
        .catch((e: Error) => done(e))
    } catch (e) {
      done(e)
    }
}
