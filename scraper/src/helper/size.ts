export const getSize = (size: string): any => {
    const parsedSize = parseInt(size)

    if (Number.isNaN(parsedSize)) {
        const regex = /^\d+|(\b\d+\s+|\d)+\s?(?=m2|m²|m\s)/gm;
        const match = regex.exec(size)
        return match ? match[0].replace(/\D/gm, '') : 0
    }

    return parsedSize
}
