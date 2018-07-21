import * as request from 'request-promise'

export default class Request {
    public get(url: string, options: any) {
        return request.get(url, options)
    }
}
