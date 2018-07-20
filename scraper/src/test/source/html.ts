import * as sinon from 'sinon'
import * as assert from 'assert'
import { HTMLSource } from '../../types/source'

const response = `
        <ul>
            <li>
                <div class="name">House 1</div>
                <div class="description">Description 1</div>
            </li>
            <li>
                <div class="name">House 2</div>
                <div class="description">Description 2</div>
            </li>
        </ul>
        <div class="next"></div>
 `
const source = new HTMLSource()
source.url = 'http://immo-site.com'
source.resultSelector = 'li'
source.nextPageSelector = '.next'
source.resultAttributes = [
    { type: 'name', selector: '.name' },
    { type: 'description', selector: '.description' }
]
source.driver = {
    setup: sinon.stub(),
    scrapePage: sinon.stub().returns(response),
    url: sinon.stub().returns(source.url),
    shutdown: sinon.stub()
}

describe('it runs the scraper', () => {
    it('scrapes results for a given url', (done) => {
        const extractResults = sinon.spy(source, 'extractResults')

        source.scrape([]).then(() => {
            assert(source.driver.setup.calledWith(source.url), 'it calls the driver with the source url')
            assert(source.driver.scrapePage.calledWith(false, '.next', 'li'), 'it scrapes pages using the result and next page selectors')
            assert(extractResults.calledWith(response, []), 'it extracts results from the page contents')
            assert.equal(extractResults.returnValues[0][0].name, 'House 1')
            assert.equal(extractResults.returnValues[0][1].name, 'House 2')
            assert.equal(extractResults.returnValues[0][0].description, 'Description 1')
            assert.equal(extractResults.returnValues[0][1].description, 'Description 2')
            assert(source.driver.shutdown.calledOnce, 'it shuts down the driver')
            done()
        })
    })
})
