import { Job, DoneCallback } from 'bull'
import ScrapedItem from '../types/ScrapedItem'
import * as request from 'request-promise'
import * as randomUserAgent from 'random-useragent'
import HTMLSite from '../types/HTMLSite'
import * as puppeteer from 'puppeteer'

interface ScrapedResponse {
  contents: string
  encoding: string
}

function getEncodingFromPageHTML()
{
  // Find the encoding from a meta tag OR headers
}

function getEncodingFromHeaders(headers: any){
  const contentType = headers['content-type'] || headers['Content-type'] || headers['Content-Type'];
  const regex = /charset=(\w+\-\w+)/gm;
  const charset = contentType.match(regex)
}

// @TODO - Return encoding and contents from these requests
async function getPageContentsWithFullLoad(url: string, userAgent: string): Promise<ScrapedResponse> {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-insecure'],
    ignoreHTTPSErrors: true,
  })

  const page = await browser.newPage()
  await page.setUserAgent(userAgent)
  await page.setExtraHTTPHeaders({
    'Content-Type': 'text/html; charset=utf-8',
    'Accept': 'text/html',
    'Accept-Language': 'fr-FR',
  })

  await page.setViewport({ width: 1280, height: 1000 })
  const response = await page.goto(url)
  const contents = await page.content()
  await page.close()
  await browser.close()

  const headers = response.headers()

  console.log(headers)

  return {
    encoding: '',
    contents
  }
}

async function getPageContentsWithRequest(url: string, userAgent: string): Promise<ScrapedResponse> {
  const contents = await request.get({
    url,
    gzip: true,
    proxy: null,
    encoding: 'utf-8',
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Accept': 'text/html',
      'Accept-Language': 'fr-FR',
      'User-Agent': userAgent,
    },
  })

  return {
    encoding: '',
    contents
  }
}

module.exports = function(job: Job, done: DoneCallback) {
    try {
      const { url, contract } = job.data
      const userAgent = randomUserAgent.getRandom()
      const getMethod = (contract.load === true) ? getPageContentsWithFullLoad : getPageContentsWithRequest
      return getMethod(url, userAgent)
        .then((response: ScrapedResponse) => {
          // decode the contents according to the encoding
          const page = new HTMLSite(contract, url, response.contents)
          return page.getMappedItems()
        })
        .then((results: ScrapedItem[]) => done(null, results))
        .catch((e: Error) => done(e))
    } catch (e) {
      done(e)
    }
}
