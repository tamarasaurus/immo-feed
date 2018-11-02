const Sequelize = require('sequelize');
const { Op, TEXT, INTEGER, FLOAT, STRING, DATE, BOOLEAN } = Sequelize

interface Filters {
  filter: string
  page: string
  minPrice: string
  maxPrice: string
  minSize: string
  maxSize: string
  sort: string
}

export class Storage {
  public database: any;
  public result: any;

  constructor() {
    this.database = new Sequelize('postgres', 'postgres', 'postgres', {
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',
      logging: false,

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
    });

    this.result = this.database.define('result', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: false,
        autoIncrement: true,
      },
      name: TEXT,
      price: INTEGER,
      size: FLOAT,
      description: TEXT,
      link: {
        type: STRING,
        primaryKey: true
      },
      createdAt: DATE,
      updatedAt: DATE,
      photo: STRING,
      hidden: { type: BOOLEAN, defaultValue: false },
      pinned: { type: BOOLEAN, defaultValue: false },
      seen: { type: BOOLEAN, defaultValue: false }
    });


    this.result.sync()
  }

  findById(id: string) {
    return this.result.findOne({ where: { id }})
  }

  async findAll(filters: Filters) {
    const { page, filter, sort, minPrice, maxPrice, minSize, maxSize } = filters
    const perPage = 48

    const where: any = {
      hidden: false,
    }

    if (filter && filter.trim().length > 0) {
      const filterWords = filter.trim().split(' ').map(word => `%${word}%`)

      where[Op.or] = [
        { description: { [Op.iLike]: { [Op.any]: filterWords } } },
        { name: { [Op.iLike]: { [Op.any]: filterWords } } },
        { link: { [Op.iLike]: { [Op.any]: filterWords } } },
      ]
    }

    if (minPrice && maxPrice) {
      where[Op.and] = [
        { price: { [Op.gte]: minPrice, [Op.lte]: maxPrice } }
      ]
    }

    if (minSize && maxSize) {
      where[Op.and] = [
        { size: { [Op.gte]: minSize, [Op.lte]: maxSize } }
      ]
    }

    console.log('where', where)

    const result = await this.result.findAndCountAll({
      offset: (perPage * parseInt(page)) - perPage,
      limit: perPage,
      order: [sort || ['createdAt', 'DESC'], ['pinned', 'DESC']],
      where,
    })

    return {
      results: result.rows,
      page: parseInt(page),
      pages: Math.ceil(result.count / perPage)
    }
  }

  updateOrCreate(result: any) {
    return this.result.upsert(result)
  }

  update(data: any, id: string) {
    return this.result.update(data, { where: { id }})
  }

  cleanup() {
    return this.database.close()
  }

  findUpdatedSince(date: Date) {
    return this.result.findAll({ where: { updatedAt: { [Op.gt]: date } } })
  }
}
