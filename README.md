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

### crontab

If you're using docker-compose, you don't have to set up the cron job (but you can customise the frequency)

However for running the app manually you can do the following:


```
crontab -e

# Add this line
*/10 * * * * /usr/local/bin/node /home/username/immo-feed/scraper/build/run.js > /home/username/log/cron.log 2>&1

```

`/user/local/bin/node` - Run `which node` to find out the path on your machine

### environment variables
- `NOTIFY` - Turn notifications on
- `SLACK_WEBHOOK_URL` - Slack
- `MONGODB_URI` - Mongo uri

### customising scraper sources

### adding a new scraper source

### deployment
