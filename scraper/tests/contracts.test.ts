import Scraper from 'contract-scraper';
import * as glob from 'glob';
import * as path from 'path';
import sites from '../src/sites.json';
import StephaneLink from '../src/attributes/StephaneLink';
import * as assert from 'assert';

// Leboncoin is unstable
const contractList = glob.sync('src/contracts/*.json').filter(name => {
  return !name.includes('leboncoin');
});

const scrapingJobs = contractList.map(contractPath => {
  const baseName = path.basename(contractPath);
  const fileName = baseName.replace(path.extname(baseName), '');

  const url = sites.find(site => site.type === fileName).url;
  const contract = require(`../${contractPath}`);

  return {
    url,
    site: fileName,
    scraper: new Scraper(
      url,
      contract,
      { 'stephane-link': StephaneLink },
      { headless: false },
    ),
    attributes: contract.attributes,
  };
});

for (let job of Object.values(scrapingJobs)) {
  const { url, site, attributes, scraper } = job;

  it(`scrapes ${site} selectors`, async () => {
    return scraper
      .scrapePage()
      .then(async scrapedItems => {
        if (scrapedItems.length === 0) {
          // console.log(await scraper.getPageContents());
        }
        assert.equal(
          scrapedItems.length > 0,
          true,
          `${site} at ${url} didn't return any results`,
        );

        Object.entries(attributes).forEach(
          ([name, attribute]: [string, any]) => {
            const items = scrapedItems.filter(item => {
              return item.hasOwnProperty(name) && item[name] !== null;
            });

            assert.equal(
              items.length > 0,
              true,
              `${site} at ${url} is missing the ${name} attribute "${
                attribute.selector
              }" -
                    \n\n ${JSON.stringify(scrapedItems[0], null, 2)}`,
            );
          },
        );
      })
      .catch(e => {
        throw e;
      });
  });
}
