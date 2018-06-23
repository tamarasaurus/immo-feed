const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/immo-feed')

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

function handleError(error: string, data: any) {
    return { type: 'failed', message: error }
}

function getSortValue(sortType: string) {
    return sortType === 'ASC' ? 1 : -1
}

export class Storage {
    findById(id: string) {
        return Result.findById(id)
    }

    findAll(sort = ['date', 'desc'], filter = '') {
        const sortParams = { [sort[0]]: getSortValue(sort[1]) }
        const filterWords = filter.trim().split(' ').join('|')
        const filterRegexp = new RegExp(filterWords, 'gmi')

        return Result.find({})
            .sort(sortParams)
            .or([
                { name: filterRegexp },
                { description: filterRegexp },
                { link: filterRegexp }
            ])
            .exec()
    }

    updateOrCreate(data: any) {
        const { link, id } = data

        return Result.findOneAndUpdate(
            id || { link },
            Object.assign(data, { $setOnInsert: { date: new Date().getTime() }}),
            { new: true, upsert: true },
            (error: any, record: any) => record
        )
    }

    cleanup() {
        mongoose.connection.close()
    }

    findUpdatedSince(date: any) {
        return Result
            .find({ date: { $gte: date } })
            .exec()
    }
}


