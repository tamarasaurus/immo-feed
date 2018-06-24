### scraper

### requirements

- node.js
- mongodb

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

`/user/local/bin/node` - Run `which node` to find out the real path


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
