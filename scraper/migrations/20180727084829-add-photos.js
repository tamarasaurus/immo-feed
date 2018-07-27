module.exports = {
  up(db) {
    return db.collection('results').aggregate([
      { $project: {
        photos: ['$photo'],
        date: 1,
        name: 1,
        price: 1,
        size: 1,
        description: 1,
        link: 1,
        hidden: 1
      }},
      { $out: "results" }
    ]).toArray()
  },

  down(db) {
    return db.collection('results').aggregate([
      { $project: {
        photo: { $arrayElemAt: [ "$photos", 0 ]},
        date: 1,
        name: 1,
        price: 1,
        size: 1,
        description: 1,
        link: 1,
        hidden: 1
      }},
      { $out: "results" }
    ]).toArray()
  }

}
