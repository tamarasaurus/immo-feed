import * as sinon from 'sinon'
import * as assert from 'assert'
import { HTMLSource } from '../../types/html-source'
import { Result } from './../../types/result'

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

const page = `
        <div>
            <li>
                <img src="photo-1.jpg" class="photo" />
            </li>
        </div>
`

const formatters: any = {}

formatters.photos = ($: any, photo: any) => {
    return [ $(photo).attr('src') || $(photo).attr('href') ]
}

const source = new HTMLSource()
source.url = 'http://immo-site.com'
source.resultSelector = 'li'
source.nextPageSelector = '.next'
source.scrapeRichAttributes = true
source.resultAttributes = [
    { type: 'name', selector: '.name' },
    { type: 'description', selector: '.description' }
]

source.richAttributes = [
    { type: 'photos', selector: '.photo'}
]

source.driver = Object.assign(source.driver, {
    setup: sinon.stub(),
    scrapePage: sinon.stub().returns(response),
    url: sinon.stub().returns(source.url),
    shutdown: sinon.stub(),
    page: {
        goto: sinon.stub(),
        evaluate: sinon.stub(),
        content: sinon.stub().returns(page)
    }
})

const result = Object.assign(new Result(), {
    url: 'http://immo-site.com/listings/1'
})

describe('it scrapes a web page', () => {
    it('scrapes results for a given url', (done) => {
        const extractFromResultList = sinon.spy(source, 'extractFromResultList')
        const extractFromResultPage = sinon.spy(source, 'extractFromResultPage')

        source.scrape(formatters).then(() => {
            assert(source.driver.setup.calledWith(source.url), 'it calls the driver with the source url')
            assert(source.driver.scrapePage.calledWith(false, '.next', 'li'), 'it scrapes pages using the result and next page selectors')
            assert(extractFromResultList.calledWith(response, formatters), 'it extracts results from the page contents')
            assert.equal(extractFromResultList.returnValues[0][0].name, 'House 1')
            assert.equal(extractFromResultList.returnValues[0][1].name, 'House 2')
            assert.equal(extractFromResultList.returnValues[0][0].description, 'Description 1')
            assert.equal(extractFromResultList.returnValues[0][1].description, 'Description 2')
            assert(extractFromResultPage.calledWith(extractFromResultList.returnValues[0][0], formatters), 'it scrapes rich attributes')
            extractFromResultPage.returnValues[0].then((richAttributes: any) => {
                assert.equal(richAttributes.photos[0], 'photo-1.jpg')
                assert(source.driver.shutdown.calledOnce, 'it shuts down the driver')
                done()
            })
        })
    })
})
