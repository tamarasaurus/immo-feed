import Scraper from 'contract-scraper';
import * as glob from 'glob'
import * as path from 'path'
import * as sites from '../src/sites.json';
import StephaneLink from '../src/attributes/StephaneLink';
import * as assert from 'assert';

const contractList = glob.sync('src/contracts/*.json')
const scrapingJobs = contractList.map((contractPath) => {
    const baseName = path.basename(contractPath)
    const fileName = baseName.replace(path.extname(baseName), '');

    const url = sites.find((site) => site.type === fileName).url;
    const contract = require(`../${contractPath}`)

    return {
        site: fileName,
        scraper: new Scraper(url, contract, { 'stephane-link': StephaneLink }),
        attributes: contract.attributes
    }
});

for (let job of Object.values(scrapingJobs))
{
    it(`scrapes ${job.site} selectors`, () => {
        return job.scraper.scrapePage().then((scrapedItems) => {
            Object.entries(job.attributes).forEach(([name, attribute]: [string, any]) => {
                const items = scrapedItems.filter((item) => {
                    return item.hasOwnProperty(name) && item[name] !== null
                });

                assert.equal(items.length > 0, true, `${job.site} is missing the ${name} attribute "${attribute.selector}" - \n\n ${JSON.stringify(scrapedItems[0], null, 2)}`);
            });
        }).catch(e => { throw e });
    })
}

