export const getPrice = (price: string): any => {
    return parseInt(price.replace(/[^0-9,.]/gm, ''))
}


