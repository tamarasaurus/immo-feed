import { getSize } from '../helper/size'

export default ($: CheerioStatic, size: CheerioStatic): string => {
    return getSize($(size).text().trim())
}
