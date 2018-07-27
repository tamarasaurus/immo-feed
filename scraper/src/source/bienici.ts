import { JSONSource } from '../types/json-source'

export default class Bienici extends JSONSource {
    public url = 'https://www.bienici.com/realEstateAds.json'
    public resultSelector = 'realEstateAds'

    public resultAttributes = [
        { type: 'name', selector: 'title' },
        { type: 'description', selector: 'description' },
        { type: 'size', selector: 'surfaceArea' },
        { type: 'price', selector: 'price' },
        {
            type: 'link',
            selector: 'id',
            format: (id: string) => `https://www.bienici.com/annonce/${id}`
        },
        {
            type: 'photos',
            selector: 'photos',
            format: (photos: any): string[] => {
                return [ (photos.length > 0 && photos[0].url) ]
            }
        }
    ]
}
