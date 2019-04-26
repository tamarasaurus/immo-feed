import scrape from '../src/jobs/scrape'
import * as assert from 'assert'
import { Job, DoneCallback } from 'bull';

const Ouestfrance = require('../src/contracts/Ouestfrance.json')


const job: any = {
    data: {
        url: 'https://www.ouestfrance-immo.com/acheter/nantes-44-44000/?types=maison,appartement',
        contract: Ouestfrance
    }
}
const callback: DoneCallback = (error, scrapedItems: any[]) => {
    console.log('done', scrapedItems)

}

const scrapedItem = scrape(job, callback)

