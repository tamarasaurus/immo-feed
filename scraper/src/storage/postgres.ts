const Sequelize = require('sequelize');
const Op = Sequelize.Op

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
      name: Sequelize.TEXT,
      price: Sequelize.INTEGER,
      size: Sequelize.FLOAT,
      description: Sequelize.TEXT,
      link: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      photo: Sequelize.STRING,
      hidden: { type: Sequelize.BOOLEAN, defaultValue: false }
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

  async updateOrCreate(result: any) {
    return this.result.findOrCreate({
        where: { link: result.link },
        defaults: result
      })
  }

  cleanup() {
    this.database.close()
  }

  findUpdatedSince(date: Date) {
    return this.result.findAll()
  }
}
