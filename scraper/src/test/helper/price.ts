import * as assert from 'assert'
import { getPrice } from '../../helper/price'

export default function() {
    assert.equal(getPrice('245 000 €'), 245000)
    assert.equal(getPrice(`784 000 €
                    plus de photos
                          : Maison
                           - CARQUEFOU
                          >>`), 784000)
    assert.equal(getPrice('80 000'), 80000)
    assert.equal(getPrice('160 500,00€'), 160500)
    assert.equal(getPrice('1 248 000 €'), 1248000)
}
