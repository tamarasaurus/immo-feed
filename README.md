# 🏠 immo-feed

[![Build Status](https://travis-ci.org/tamarasaurus/immo-feed.svg?branch=master)](https://travis-ci.org/tamarasaurus/immo-feed)

An API to aggregate real-estate listings from these sites:
- Blot
- Francois et Francois Immobilier
- LaForet
- Leboncoin
- Ouestfrance immo
- Seloger
- Stephane
- Thierry

### Installation

```
cd scraper && npm install
cd api && npm install
docker-composer up -d --build
```

Go to `http://localhost:8000/results` to get the results in JSON
Go to `http://localhost:4567` to monitor the scraping jobs
