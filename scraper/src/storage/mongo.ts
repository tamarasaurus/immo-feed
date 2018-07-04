const mongoose = require('mongoose')

const Result = mongoose.model('Result', {
    date: Date,
    name: String,
    price: { type: Number },
    size: Number,
    description: String,
    link: { type: String, unique: true },
    photo: String,
    hidden: { type: Boolean, default: false }
})

function getSortValue(sortType: string) {
    return sortType === 'ASC' ? 1 : -1
}

export class Storage {
    constructor() {
        let path = 'localhost'
        if (process.env.MONGODB_URI) path = process.env.MONGODB_URI
        mongoose.connect(`mongodb://${path}/immo-feed`)
    }

    findById(id: string) {
        return Result.findById(id)
    }

    async findAll(page: string = '1', sort = ['date', 'desc'], filter = '') {
        const sortParams = { [sort[0]]: getSortValue(sort[1]) }
        const filterWords = filter.trim().split(' ').join('|')
        const filterRegexp = new RegExp(filterWords, 'gmi')
        const perPage = 18

        const count = await Result.count().exec()
        const results = await Result.find({})
            .skip((perPage * parseInt(page)) - perPage)
            .limit(perPage)
            .sort(sortParams)
            .or([
                { name: filterRegexp },
                { description: filterRegexp },
                { link: filterRegexp }
            ])
            .exec()

        return {
            results,
            page: parseInt(page),
            pages: Math.round(count / perPage)
        }
    }

    updateOrCreate(data: any) {
        const { link, id } = data

        return Result.findOneAndUpdate(
            id ? { _id: id } : { link },
            Object.assign(data, { $setOnInsert: { date: new Date().getTime() } }),
            { new: true, upsert: true }
        )
    }

    cleanup() {
        return mongoose.connection.close()
    }

    findUpdatedSince(date: Date) {
        return Result
            .find({ date: { $gte: date } })
            .exec()
    }
}


