import { JSONSource } from '../json-source'

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
            type: 'photo',
            selector: 'photos',
            format: (photos: any): string[] => {
                return photos.map((photo: any) => photo.url)[0]
            }
        },
        {
            type: 'photos',
            selector: 'photos',
            format: (photos: any): string[] => {
                return photos.map((photo: any) => photo.url)
            }
        }
    ]
}
