type Rating = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'
type Type = 'apartment' | 'house' | 'studio'

class ContactDetails {
    name: string
    address: string
    siret: string
    siren: string
    email: string
    number: string
}

class ResultDetails {
    photos: string[]
    type: Type
    rooms: number
    ges: Rating
    class_energie: Rating
    furnished: boolean
    fees: number
    charges_included: boolean
    contact: ContactDetails
    location: string
}

export class Result {
    name: string
    price: number
    size: number
    description: string
    link: string
    photo: string
    date: number
    details: ResultDetails
}
