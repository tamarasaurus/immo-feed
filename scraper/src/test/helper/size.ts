import * as assert from 'assert'
import { getSize } from '../../helper/size'

export default function() {
    assert.equal(getSize('the size is 123m² squared and number 10'), 123)
    assert.equal(getSize('the house is 10 m²'), 10)
}
