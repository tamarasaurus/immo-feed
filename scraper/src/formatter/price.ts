import { getPrice } from '../helper/price'

export default ($: CheerioStatic, price: CheerioStatic): string => {
    return getPrice(($(price).text().trim()) || '0')
}
