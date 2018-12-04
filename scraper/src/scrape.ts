import * as Queue from 'bull'
import ScrapedItem from './types/ScrapedItem'
import chalk from 'chalk'

const scrapeAttributes = new Queue('scrape_attributes', process.env.REDIS_URL)
const store = new Queue('store_results', process.env.REDIS_URL)
const sites = require('./sites.json')

scrapeAttributes.process('scrape', 1, require('./jobs/scrape.ts'))
scrapeAttributes
  .on('error', error => console.error('Error scraping', error))
  .on('active', job => console.log('\n\n🠮 Scrape', job.data.name, '\n     🌐', job.data.url))
  .on('completed', function(job: Queue.Job, items: ScrapedItem[]) {
    console.log('\nFound', items.length, 'results for', job.data.name)

    for (const item of items) {
      store.add('store', item)
    }
  })

store
  .on('completed', (job: Queue.Job) => {
    console.log('    ', chalk.green('✓'), job.data.name)
  })
  .on('error', (error: Error, job: Queue.Job) => {
    console.log('    ', chalk.red('⨯'), job.data.name)
  })

store.process('store', 500, require('./jobs/store'))

function getPaginatedURLs(url: string, pageQuery: string, pages: number) {
  const urlParts = url.split('?')
  const searchParams = new URLSearchParams(urlParts[1])
  const urls = []

  for (let i = 1; i < (pages + 1); i++) {
    searchParams.set(pageQuery, i.toString())
    const paginatedURL = new URL(urlParts[0])
    paginatedURL.search = searchParams.toString()
    urls.push(paginatedURL.toString())
  }

  return urls;
}

function scrape() {
  sites.forEach((siteData: any) => {
    const [ name, url, pages ] = siteData
    const contract: any = require(`./contracts/${name}.json`)
    const { pageQuery } = contract

    if (pageQuery === undefined && pages === undefined) {
      scrapeAttributes.add('scrape', { name, contract, url })
    } else {
      const urls = getPaginatedURLs(url, pageQuery, pages)
      urls.forEach((url: string) => {
        scrapeAttributes.add('scrape', { name, contract, url })
      })
    }
  })
}

function run() {
  console.log(chalk.bgGreen('🏠 immo-feed \n\n'))

  scrape()

  setInterval(function() {
    scrape()
  }, parseInt(process.env.SCRAPER_FREQUENCY_MINUTES || '10', 10) * 60 * 1000)
}

run()
