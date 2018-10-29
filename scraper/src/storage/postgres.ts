const Sequelize = require('sequelize');

export class Storage {
  public database: any;
  public result: any;

  constructor() {
    this.database = new Sequelize('immo-feed', 'postgres', 'postgres', {
      host: process.env.POSTGRES_HOST,
      dialect: 'postgres',

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
    });

    this.result = Sequelize.define('result', {
      date: Date,
      name: String,
      price: { type: Number },
      size: Number,
      description: String,
      link: { type: String, unique: true },
      photo: String,
      hidden: { type: Boolean, default: false },
    });

    console.log(this.database)
  }

  findById(id: string) {

  }

  findAll(page: string = '1', filter = '', sort = ['date', 'desc']) {

  }

  updateOrCreate(results: any) {

  }

  cleanup() {

  }

  findUpdatedSince(date: Date) {

  }
}
