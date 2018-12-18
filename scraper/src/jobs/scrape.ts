import { Job, DoneCallback } from 'bull'
import ScrapedItem from '../types/ScrapedItem'
import * as request from 'request-promise'
import * as randomUserAgent from 'random-useragent'
import HTMLSite from '../types/HTMLSite'
import * as puppeteer from 'puppeteer'
import * as jschardet from 'jschardet'
import * as cheerio from 'cheerio'
import * as Iconv from 'iconv'

interface ScrapedResponse {
  contents: string
  encoding: string
}

function getCharsetFromContentType(contentType: string) {
  const regex = /(?<=charset=)[^;]*/gm
  const charset = regex.exec(contentType);
  return charset;
}

function getContentTypeHeaders(headers: any) {
  return headers['content-type'] || headers['Content-type'] || headers['Content-Type']
}

function getContentTypeFromHTML(contents: string) {
  const $ = cheerio.load(contents)
  return $('meta[charset]').attr('charset');
}

function guessEncoding(contentType: string, contents: string) {
  const headerCharset = getCharsetFromContentType(contentType);

  if (headerCharset) {
    return headerCharset;
  }

  const metaCharset = getContentTypeFromHTML(contents)

  if (metaCharset) {
    return metaCharset;
  }

  return jschardet.detect(contents).encoding
}

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

  const contentType = getContentTypeHeaders(await response.headers())

  return {
    encoding: guessEncoding(contentType, contents),
    contents
  }
}

async function getPageContentsWithRequest(url: string, userAgent: string): Promise<ScrapedResponse> {
  const response = await request.get({
    url,
    gzip: true,
    proxy: null,
    encoding: 'utf-8',
    resolveWithFullResponse: true,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Accept': 'text/html',
      'Accept-Language': 'fr-FR',
      'User-Agent': userAgent,
    },
  })

  return {
    encoding: guessEncoding(response.headers, response.body),
    contents: response.body
  }
}

module.exports = function(job: Job, done: DoneCallback) {
    try {
      const { url, contract } = job.data
      const userAgent = randomUserAgent.getRandom()
      const getMethod = (contract.load === true) ? getPageContentsWithFullLoad : getPageContentsWithRequest
      return getMethod(url, userAgent)
        .then((response: ScrapedResponse) => {
          const lib: any = Iconv
          const converter: any = lib['Iconv']
          const iconv = new converter(response.encoding, 'UTF-8//IGNORE//TRANSLIT');
          const normalizedContents = iconv.convert(response.contents).toString('utf-8');
          const page = new HTMLSite(contract, url, normalizedContents)
          return page.getMappedItems()
        })
        .then((results: ScrapedItem[]) => done(null, results))
        .catch((e: Error) => done(e))
    } catch (e) {
      done(e)
    }
}
