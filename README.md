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

Visit `http://localhost:8080` to see and manage the results

### api

- `GET /results` - list all the results (not yet paginated)
- `GET /results/:id` - get a single result
- `POST /results/:id/hide` - hide a result

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

In the `./scraper/src/source/` folder you will find the default scrapers. Each scraper corresponds to a search url that will be requested and parsed. 

Each result can have these properties:

```javascript
export class Result {
    name: string
    price: number
    size: number
    description: string
    link: string
    image: string
    date: number
}

```

So in each scraper we specify a set of selectors where these attribute can be found.

A scraper can parse a HTML or JSON response. For HTML:  

``` javascript
// Use the HTML scraper type
import { HTMLSource } from '../types/source'

export default class Thierry extends HTMLSource {
    // We give the scraper the search URL that contains the results
    public url = 'https://www.thierry-immobilier.fr/vente/appartement--maison'

    // We define where the scraper can find the list of items in the page
    public resultSelector = '.teaser--immobilier'

    // We map each Result attribute to a selector
    public resultAttributes = [
        { 
            type: 'name', 
            selector: '.teaser__title' 
            
            // Each attribute comes with a default formatter but we can define a custom one to extract the data we want from the `.teaser__title` element
            format($: CheerioStatic, photo: CheerioStatic): string {
                return $(photo).attr('data-whatever')
            }
        },
        { type: 'description', selector: '.teaser__body .dot-ellipsis p' },
        { type: 'size', selector: '.teaser__additional-inner span:nth-child(2)' },
        { type: 'price', selector: '.teaser__price b' },
        { type: 'link', selector: '> a' },
        { type: 'photo', selector: '.field-type-image img', }
    ]
}
```

### adding a new scraper source

### deployment
