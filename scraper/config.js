const url = process.env.MONGODB_URI ? `mongodb://${process.env.MONGODB_URI}:27017` : 'mongodb://localhost:27017'

console.log('Mongo url', url)
module.exports = {
  mongodb: {
    url,
    databaseName: "immo-feed",
  },

  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
};
