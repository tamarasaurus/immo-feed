export const getFromBackgroundImage = (text: string) => {
    const image: any[] = /(background-image:\s?url\("?)(.*)("?\))/gm.exec(text)
    if (image) return image[2]
    return null
}
