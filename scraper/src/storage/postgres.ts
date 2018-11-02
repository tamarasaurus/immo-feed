import { isEmpty, get } from 'lodash'
import * as Sequelize from 'sequelize'
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

  findPinned() {
    return this.result.findAll({ where: { pinned: true }})
  }

  async findAll(filters: Filters) {
    const perPage = 48
    const filter = get(filters, 'filter')
    const page = get(filters, 'page', '1')
    const sort = get(filters, 'sort', ['createdAt', 'DESC'])
    const minSize = get(filters, 'minSize', 0)
    const maxSize = get(filters, 'maxSize', 99999999999)
    const minPrice = get(filters, 'minPrice', 0)
    const maxPrice = get(filters, 'maxPrice', 99999999999)

    const where: any = {
      hidden: false,
      pinned: false,
      size: { [Op.gte]: minSize, [Op.lte]: maxSize },
      price: { [Op.gte]: minPrice, [Op.lte]: maxPrice },
    }

    if (filter !== undefined && !isEmpty(filter)) {
      const filterWords = filter.trim().split(' ').map(word => `%${word}%`)

      filterWords.push(`%${filter}%`)

      where[Op.or] = [
        { description: { [Op.iLike]: { [Op.any]: filterWords } } },
        { name: { [Op.iLike]: { [Op.any]: filterWords } } },
        { link: { [Op.iLike]: { [Op.any]: filterWords } } },
      ]
    }

    const result = await this.result.findAndCountAll({
      offset: (perPage * parseInt(page)) - perPage,
      limit: perPage,
      order: [sort],
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
    console.log('update with', data)
    return this.result.update(data, { where: { id }})
  }

  cleanup() {
    return this.database.close()
  }

  findUpdatedSince(date: Date) {
    return this.result.findAll({ where: { updatedAt: { [Op.gt]: date } } })
  }
}
