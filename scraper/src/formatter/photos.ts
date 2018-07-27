export default ($: CheerioStatic, photo: CheerioStatic): string[] => {
    return [ $(photo).attr('src') || $(photo).attr('href') ]
}
