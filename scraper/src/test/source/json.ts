import * as sinon from 'sinon'
import * as assert from 'assert'
import { JSONSource } from '../../types/json-source'

const source = new JSONSource()
source.resultSelector = 'results'
source.url = 'http://immo-source.com/json'
source.resultAttributes = [
    { type: 'name', selector: 'name' },
    { type: 'description', selector: 'description' }
]

const response = {
    body: JSON.stringify({
        results: [
            {
                name: 'House 1',
                description: 'Description 1'
            },
            {
                name: 'House 2',
                description: 'Description 2'
            }
        ]
    })
}

source.driver = {
    get: sinon.stub().returns(response)
}

describe('it scrapes a json response', () => {
    it('scrapes results given a url', (done) => {
        const contents = sinon.spy(source, 'getContents')

        source.scrape().then((results) => {
            assert(contents.calledOnce)
            assert(source.driver.get.calledWith(source.url, { resolveWithFullResponse: true }))
            assert.equal(results[0].name, 'House 1')
            assert.equal(results[1].name, 'House 2')
            assert.equal(results[0].description, 'Description 1')
            assert.equal(results[1].description, 'Description 2')
        })
        done()
    })
})
