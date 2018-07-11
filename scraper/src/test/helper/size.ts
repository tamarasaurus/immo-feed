import * as assert from 'assert'
import { getSize } from '../../helper/size'

export default function() {
    assert.equal(getSize('the size is 123m² squared and number 10'), 123)
    assert.equal(getSize('the house is 10 m²'), 10)
    assert.equal(getSize('A vendre 4 pièces 93m²'), 93)
    assert.equal(getSize('Terrain 436 m² La Plaine Des Cafres'), 436)
    assert.equal(getSize('Maison de maître hyper centre de 300m2 avec vue'), 300)
    assert.equal(getSize('Terrain 1 001 m² Richebourg'), 1001)
    assert.equal(getSize('Du volume pour ce pavillon individuel de 1997'), 0)
    assert.equal(getSize('Grand appartement F3/4 de 75m² avec balcon'), 75)
    assert.equal(getSize('Gennevilliers-Appt F4-76m² rénové +2 parkings+cave'), 76)
    assert.equal(getSize('Luxueux duplex 220m carré Grasse St Jean'), 220)
    assert.equal(getSize('42,13 m²'), 42)
    assert.equal(getSize('Maison 15mn de l’ocean, avec piscine 5X10 ,110m2'), 110)
    assert.equal(getSize('CENTRE HISTORIQUE ECUSSON T2 T3 55 m²'), 55)
}
