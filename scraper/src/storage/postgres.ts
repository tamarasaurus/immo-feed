const Sequelize = require('sequelize');
const { Op, TEXT, INTEGER, FLOAT, STRING, DATE, BOOLEAN } = Sequelize

export class Storage {
  public database: any;
  public result: any;

  constructor() {
    this.database = new Sequelize('postgres', 'postgres', 'postgres', {
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',

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
      hidden: { type: BOOLEAN, defaultValue: false }
    });


    this.result.sync()
  }

  findById(id: string) {
    return this.result.findById(id)
  }

  async findAll(page: string = '1', filter = '', sort = ['createdAt', 'DESC']) {
    const perPage = 18
    const filterWords = filter.trim().split(' ').map(word => `%${word}%`)
    const where: any = {
      hidden: false,
    }

    if (filter.trim().length > 0) {
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
    return this.result.update(data, { where: { id }})
  }

  cleanup() {
    return this.database.close()
  }

  findUpdatedSince(date: Date) {
    return this.result.findAll({
      where: {
        updatedAt: {
          [Op.gt]: date
        }
      }
    })
  }
}
