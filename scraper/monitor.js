const Arena = require('bull-arena');
const express = require('express');
const router = express.Router();

const arena = Arena({
  queues: [
    {
        "name": "scrape_attributes",
        "hostId": "scrape_attributes",
        "host": "cache",
        "port": 6379
    },
    {
        "name": "store_results",
        "hostId": "store_results",
        "host": "cache",
        "port": 6379
    },
    {
        "name": "scrape_detailed_attributes",
        "hostId": "scrape_detailed_attributes",
        "host": "cache",
        "port": 6379
    }
  ]
});

router.use('/', arena);
