### immo-feed

immo-feed scrapes french real estate websites like leboncoin, ouestfrance, bienici etc.. for listings and makes the aggregated results available with a simple api and frontend. it's super easy to create new scrapers and customise the existing ones to suit your search.

![feed](https://user-images.githubusercontent.com/1336344/41823180-13dc8342-77fc-11e8-9815-fc0dd96bdcb2.png)

### requirements

- node.js
- mongodb
- docker, docker-compose (optional)

### setup

- Make sure mongodb is running

```
    cd scraper && npm install
    cd frontend && npm install

    cd scraper && npm start && npm run serve
    cd frontend && npm start
```

Visit `http://localhost:3000` to see and manage the results

### crontab

For example, running the scraper every 10 minutes

`/user/local/bin/node` - Run `which node` to find out the path on your machine


```
crontab -e

# Add this line
*/10 * * * * /usr/local/bin/node /home/username/immo-feed/scraper/build/run.js > /home/username/log/cron.log 2>&1

```

### environment variables
`NOTIFY` - Turn notifications on
`SLACK_WEBHOOK_URL` - Slack
`MONGODB_URI` - Mongo uri
`PORT` - Port for the api

### adding a new scraper

### deployment
