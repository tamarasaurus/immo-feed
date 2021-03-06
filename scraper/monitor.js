const Arena = require('bull-arena');
const Bull = require('bull');

const express = require('express');
const router = express.Router();

const arena = Arena({
  Bull,
  queues: [
    {
      name: 'scrape_attributes',
      hostId: 'scrape_attributes',
      host: 'cache',
      port: 6379,
    },
    {
      name: 'store_results',
      hostId: 'store_results',
      host: 'cache',
      port: 6379,
    },
  ],
});

router.use('/', arena);
