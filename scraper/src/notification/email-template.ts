import { Result } from './../sources/result'

export default function emailTemplate(results: Result[]) {
    let resultsList = `<ul style="list-style: none; padding: 0; margin; 0;">`

    results.forEach((result: Result) => {
        resultsList += `<li style="height: 300px; font-family: 'Arial', 'Helvetica', sans-serif; list-style:none;padding:0;margin:0; width: 320px; display: block; float: left;margin-right: 40px; margin-bottom: 40px;"">
                <a style="color: #5992C7;text-decoration: none;"  href="${result.link}">
                    <div style="margin-bottom: 20px; background-image: url(${result.photo || ''}); width: 300px; height: 200px; background-size: cover; background-position: 50%; background-repeat: no-repeat;display: block; float: left; background-color: #eee"></div>
                    <strong style="display: block; width: 100%; float: left;">${result.name} (${result.date.toLocaleString()}) -  <span>${result.price.toLocaleString()} euros | ${result.size}m²</span></strong>
                    <p style="color:black;margin-top:20px;display:block;float:left;max-height: 100px;overflow: hidden;text-overflow: ellipsis;word-break: break-word;white-space: nowrap;max-width: 100%;">${result.description}</p>
                </a>
        </li>`
    })

    resultsList += `</ul>`
    return resultsList
}
