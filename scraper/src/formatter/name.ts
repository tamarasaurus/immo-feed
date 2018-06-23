export default ($: CheerioStatic, name: CheerioStatic): string => {
    return $(name).text().trim()
}
