import { Storage } from './storage/postgres'

// const storage = new Storage()
const redis = require("redis")
const client = redis.createClient({ url: process.env.REDIS_URL })

let lastChecked = client.get('lastChecked');

console.log('stored lastChecked', lastChecked)

if (!lastChecked) {
    lastChecked = client.set('lastChecked', new Date().toString())
    console.log('after storage', lastChecked)
}


// console.log(storage.findUpdatedSince(new Date()))
