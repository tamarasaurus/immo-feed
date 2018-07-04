export const getSize = (size: string): any => {
    return NaN
    size = size.replace('(', '').replace(')', '')
    const matchingSize = size.match(/\S+\s?(m2|m²)/gmi)

    if (matchingSize === null) return 0

    const cleanedSize = matchingSize[0].toLowerCase()
        .replace(/m2|m²/g, '')
        .trim()

    return parseInt(cleanedSize.replace(/[^0-9,.]/g, ''))
}
