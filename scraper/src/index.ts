import Queue from 'bull';
import chalk from 'chalk';

const scrapeAttributes = new Queue('scrape_attributes', process.env.REDIS_URL);
const store = new Queue('store_results', process.env.REDIS_URL);
const sites = require('./sites.json');

scrapeAttributes.process('scrape', 1, require('./jobs/scrape.ts').default);
scrapeAttributes
  .on('error', error => console.error('Error scraping', error))
  .on('active', job =>
    console.log('\n\n🠮 Scrape', job.data.name, '\n     🌐', job.data.url),
  )
  .on('completed', function (job: Queue.Job, items: any[]) {
    console.log('\nFound', items.length, 'results for', job.data.name);

    for (const item of items) {
      store.add('store', item);
    }
  });

store
  .on('completed', (job: Queue.Job) => {
    console.log('    ', chalk.green('✓'), job.data.name);
  })
  .on('error', (error: Error, job: Queue.Job) => {
    console.log('    ', chalk.red('⨯'), job.data.name);
  });

store.process('store', 500, require('./jobs/store'));

function scrape() {
  sites.forEach((siteData: any) => {
    const { type, url } = siteData;
    const contract: any = require(`./contracts/${type}.json`);
    scrapeAttributes.add('scrape', { name: type, contract, url });
  });
}

function run() {
  console.log(chalk.bgGreen('🏠 immo-feed \n\n'));

  scrape();

  setInterval(function () {
    scrape();
  }, parseInt(process.env.SCRAPER_FREQUENCY_MINUTES || '10', 10) * 60 * 1000);
}

run();
