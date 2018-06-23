export const getPrice = (price: string): any => {
    return parseInt(price.replace(/\D+/g, ''))
}


