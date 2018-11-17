# 🏠 immo-feed

[![Build Status](https://travis-ci.org/tamarasaurus/immo-feed.svg?branch=master)](https://travis-ci.org/tamarasaurus/immo-feed)

immo-feed scrapes french real estate websites like leboncoin, ouestfrance, bienici etc. for listings and makes the aggregated results available with a simple api and frontend. it's super easy to create new scraper sources and customise the existing ones to suit your search.

![immo-feed-1.2.0](https://user-images.githubusercontent.com/1336344/42539414-619a6b70-849b-11e8-8b51-5db87fe398b5.png)

# Changelog

Check it out here - [CHANGELOG.md](https://github.com/tamarasaurus/immo-feed/blob/master/CHANGELOG.md)

# How it works

immo-feed is made of:

- a list of customisable sources (websites or json) to scrape for results
- a `scraper` that starts the scraper and runs every x minutes
- a postgres database to store the results
- a tiny api to access the results
- a frontend app to view the results

## Requirements

- node.js (>= v8.1.0)
- docker (~v18.03), docker-compose (~v1.19.0) (optional)

# Setup

## Customising the scraper frequency

You can run the scraper in a couple of ways:

```bash
# manually
cd scraper && SCRAPER_FREQUENCY_MINUTES=15 npm run start

# using docker-compose
SCRAPER_FREQUENCY_MINUTES=15 docker-compose run --rm runner
```

The `SCRAPER_FREQUENCY_MINUTES` environment variable is passed to the runner script, which executes the scrapers every x minutes.

## Environment variables
- `SCRAPER_FREQUENCY_MINUTES` - How often the scrapers should be run

## To start with docker

```bash
docker-compose up --build
```

To view the logs you can run

```bash
docker-compose logs -f --tail=10
```

## To start manually

- Make sure mongodb is running

```bash
cd scraper && npm install
cd app && npm install

# in three separate processes for each command:
cd scraper && npm start # starts the scraper
cd scraper && npm run serve # starts the api
cd app && npm start # serves the app
```

## Accessing the results

### app

Visit `http://localhost:3000` to see and manage the results

### API

Visit `http://localhost:8000` with these endpoints to acess the API:

- `GET /results` - list all the results (not yet paginated)
- `GET /results/:id` - get a single result
- `POST /results/:id/hide` - hide a result
- `GET /export?type=csv&download=true|false` - export all results (type is json by default)

## Customising scraper sources

### The short explanation

In each file inside `./scraper/src/source/` replace the `url` value with your own search URL for that website (with your own parameters like price or location).

For example, inside `./scraper/src/source/leboncoin.ts`, you can do this:

```diff
- public url = 'https://www.leboncoin.fr/ventes_immobilieres/offres/'
+ public url = 'https://www.leboncoin.fr/recherche/?category=9&real_estate_type=2&price=min-400000&square=25-50'

```

To apply the changes:

```bash
# docker
docker-compose up --build && docker-compose restart

# manually
cd scraper && npm start

```

If you visit `http://localhost:3000` you can view the results as they are scraped and stored.

### The long explanation

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

A scraper can parse a HTML or JSON response. For HTML we receive the whole body of a page and parse it using [Cheerio](https://github.com/cheeriojs/cheerio) (jQuery-like selector syntax). Then we can map elements by selector to a Result attribute.

``` javascript
// Use the HTML scraper type
import { HTMLSource } from '../sources/html-source'

export default class Thierry extends HTMLSource {
    // We give the scraper the search URL that contains the results
    public url = 'https://www.thierry-immobilier.fr/vente/appartement--maison'

    // We define the selector for each list item element
    public resultSelector = '.teaser--immobilier'

    // Provide the selector for the next page button
    public nextPageSelector = '.pager-next > a'

    // Specify how many pages we should scrape each time (1 by default)
    public pagesToScrape: number = 5

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

For a JSON response, it's pretty much the same:

```javascript
import { JSONSource } from '../sources/json-source'

export default class Bienici extends JSONSource {
    // We point to a .json instead of a html page
    public url = 'https://www.bienici.com/realEstateAds.json'

    // We use a JSON property selector that is an array containing the results
    public resultSelector = 'realEstateAds'

    // Each selector is just an object property
    public resultAttributes = [
        { type: 'name', selector: 'title' },
        { type: 'description', selector: 'description' },
        { type: 'size', selector: 'surfaceArea' },
        { type: 'price', selector: 'price' },
        {
            type: 'link',
            selector: 'id',
            format: (id: string) => `https://www.bienici.com/annonce/${id}`
        },
        {
            type: 'photo',
            selector: 'photos',

            // If we want to access an array item at a particular index we can use a custom formatter. In `photos` it will return the array of photos that we specified in the `selector` property above.
            format: (photos: any) => {
                return photos.length > 0 && photos[0].url
            }
        }
    ]
}
```

## Adding a new scraper source

If you want to add a new scraper, it's pretty simple:

1. Decide whether it's a HTML or JSON source

```javascript
import { HTMLSource } from '../sources/html-source'

export default class MySource extends HTMLSource {
    ...
}

```

2. Provide a search URL that displays a list of results

```javascript
import { HTMLSource } from '../sources/html-source'

export default class MySource extends HTMLSource {
    public url = 'https://www.super-cool-immobilier/nantes/results'
}

```

3. Define the selectors

```javascript
import { HTMLSource } from '../sources/html-source'

export default class MySource extends HTMLSource {
    public url = 'https://www.super-cool-immobilier/nantes/results'
    public resultSelector = 'li.result'
    public nextPageSelector = 'button.next-page'
    public pagesToScrape = 2
}

```

4. Define where the scraper can find each attribute inside the `li.result` element

```javascript
import { HTMLSource } from '../sources/html-source'

export default class MySource extends HTMLSource {
    public url = 'https://www.super-cool-immobilier/nantes/results'
    public resultSelector = 'li.result'
    public nextPageSelector = 'button.next-page'
    public pagesToScrape = 2

    public resultAttributes = [
        // So we can find the name of the result inside `li.result .item_title`
        { type: 'name', selector: '.item_title' },
        { type: 'description', selector: '.ispro' },
    ...

```

And that's all you need to do !

5. Rebuild and restart the scrapers

```bash
# docker
docker-compose up --build && docker-compose restart

# manually
cd scraper && npm start

```

## Testing

Every scraper in the `./scraper/source/` directory is tested automatically (and each time a new one is added) on Travis CI nightly. To run the tests locally you can do:

```bash
# docker
docker-compose run --rm test npm run test

# manually
cd scraper && npm test
```
