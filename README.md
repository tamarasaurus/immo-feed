### immo-feed

immo-feed scrapes french real estate websites like leboncoin, ouestfrance, bienici etc.. for listings and makes the aggregated results available with a simple api and frontend. it's super easy to create new scraper sources and customise the existing ones to suit your search.

![feed](https://user-images.githubusercontent.com/1336344/41823195-53306a0e-77fc-11e8-84d2-4bcf11dbc702.png)

### requirements

- node.js (>= v8.1.0)
- mongodb (>= v3.4)
- docker (~v18.03), docker-compose (~v1.19.0) (optional)

### setup

#### To run with docker

```
docker-compose up --build
```

#### To run manually

- Make sure mongodb is running

```
cd scraper && npm install
cd frontend && npm install

cd scraper && npm start && npm run serve
cd frontend && npm start
```

Visit `http://localhost:3000` to see and manage the results

### running the scraper

You can run the scraper in a couple of ways:

```
# manually
cd scraper && SCRAPER_FREQUENCY=15 npm run start

# using docker-compose
SCRAPER_FREQUENCY=15 docker-compose run --rm runner
```

The `SCRAPER_FREQUENCY` environment variable is passed to the runner script, which executes the scrapers every x minutes. 

### environment variables
- `NOTIFY` - Turn notifications on
- `SLACK_WEBHOOK_URL` - Your webhook url for Slack notifications
- `SCRAPER_FREQUENCY` - How often the scrapers should be run (in minutes)

### customising scraper sources

### adding a new scraper source

### deployment
