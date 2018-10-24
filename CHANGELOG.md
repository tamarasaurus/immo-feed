# Changelog

## 1.3.0
- [#27](https://github.com/tamarasaurus/immo-feed/issues/27) Write unit tests for helpers
- [#19](https://github.com/tamarasaurus/immo-feed/issues/19) Add tests for scraper runner and sources
- Improved regex for price and size helpers
- Refactor sources
- Add colours to logs

BC Breaks
- Split `HTMLSource` and `JSONSource` into separate files at `/scraper/src/sources/html-source.ts` and `/scraper/src/sources/json-source.ts`. If you have custom sources you'll need to update your imports.

## 1.2.0
- [#25](https://github.com/tamarasaurus/immo-feed/issues/25) Add email notifications with Mailgun (see [Setting up notifications](https://github.com/tamarasaurus/immo-feed#setting-up-notifications))
- [#26](https://github.com/tamarasaurus/immo-feed/issues/26) Add CSV and JSON export endpoint with a download option
- [#30](https://github.com/tamarasaurus/immo-feed/issues/30) Fix pagination when results are hidden in the UI

## 1.1.0
- Add tests for scraper sources [#18](https://github.com/tamarasaurus/immo-feed/issues/18) [#17](https://github.com/tamarasaurus/immo-feed/issues/17)
    - These are run nightly on Travis CI for every source
    - Can also be run locally (see [Testing](https://github.com/tamarasaurus/immo-feed#testing))
- Add handling of multiple pages in the runner [#21](https://github.com/tamarasaurus/immo-feed/issues/21)
    - Now you can specify these new properties in your sources (see [Adding a new source](https://github.com/tamarasaurus/immo-feed#adding-a-new-scraper-source)):
    ```
        // The selector for the next page button
        public nextPageSelector = '.pager-next > a'

        // How many pages do you want to scrape
        public pagesToScrape: number = 5
    ```
- Add pagination in the database, api and frontend [#23](https://github.com/tamarasaurus/immo-feed/issues/23)
- Run the scrapers sequentially to improve stability
- Add some clearer and prettier logging to the runner [#1](https://github.com/tamarasaurus/immo-feed/issues/30)

## 1.0.0
- First release of the app !
