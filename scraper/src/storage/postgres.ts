const Sequelize = require('sequelize');

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
      name: Sequelize.STRING,
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

  findAll(page: string = '1', filter = '', sort = ['date', 'DESC']) {
    return this.result.findAll({ hidden: false })
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
