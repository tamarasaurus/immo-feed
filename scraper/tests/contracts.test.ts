import * as scrape from '../src/jobs/scrape'
import * as assert from 'assert'
import ScrapedItem from '../src/types/ScrapedItem';
import { Job, DoneCallback } from 'bull';

const job: any = {
    data: {
        url: '',
        contract: ''
    }
}
const callback: DoneCallback = () => {
    console.log('done')
}

console.log(scrape)
// const scrapedItem: ScrapedItem = scrape(job, callback)

