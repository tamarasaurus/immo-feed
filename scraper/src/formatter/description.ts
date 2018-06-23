export default ($: CheerioStatic, description: CheerioStatic): string => {
    return $(description).text().trim()
}
