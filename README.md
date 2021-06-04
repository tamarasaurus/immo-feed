# 🏠 immo-feed

[![Build Status](https://travis-ci.org/tamarasaurus/immo-feed.svg?branch=master)](https://travis-ci.org/tamarasaurus/immo-feed)

An API to aggregate real-estate listings from these sites:

- Blot
- Francois et Francois Immobilier
- LaForet
- Leboncoin
- Ouestfrance immo
- Stephane
- Thierry

### Installation

Install Docker & Docker compose

```
./install.sh
./scrape.sh
```

Go to `http://localhost:8000/results` to get the results in JSON
Go to `http://localhost:4567` to monitor the scraping jobs
