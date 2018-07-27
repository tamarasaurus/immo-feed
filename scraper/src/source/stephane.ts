import { HTMLSource } from '../types/html-source'

export default class Stephane extends HTMLSource {
    public url = 'http://www.stephaneplazaimmobilier-nantesest.com/catalog/result_carto.php?action=update_search&map_polygone=&C_28=Vente&C_28_search=EGAL&C_28_type=UNIQUE&site-agence=&C_65_search=CONTIENT&C_65_type=TEXT&C_65=44+NANTES&C_65_temp=44+NANTES&cfamille_id=&C_33_search=COMPRIS&C_33_type=TEXT&C_33_MIN=&C_33_MAX=&C_30_search=INFERIEUR&C_30_type=NUMBER&C_30=&C_30_format_quick='
    public resultSelector = '[data-product-id]'

    public resultAttributes = [
        { type: 'name', selector: '.item-products_pieces' },
        { type: 'description', selector: '.item-products_address' },
        { type: 'price', selector: '.item-products_price' },
        { type: 'size', selector: '.item-products_pieces' },
        {
            type: 'photos',
            selector: '.slides-image.webresize',
            format($: CheerioStatic, photo: CheerioElement): string[] {
                const style = $(photo).attr('style')
                let imageUrl = /(background-image: url\(")(.*)("\))/gm.exec(style)[2]
                imageUrl = imageUrl.split('../')[1]
                return [`http://www.stephaneplazaimmobilier-nantesest.com/${imageUrl}`]
            }
        },
        {
            type: 'link',
            format($: CheerioStatic, link: CheerioElement): string {
                const url = $(link).data('url').split('?')[0]
                return `http://www.stephaneplazaimmobilier-nantesest.com${url}`
            }
        }
    ]
}
