export default ($: CheerioStatic, link: CheerioStatic): string => {
    return $(link).attr('href')
}
