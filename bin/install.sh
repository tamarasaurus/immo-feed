#!/bin/bash

docker-compose run --rm scraper npm install
docker-compose run --rm api npm install
docker-compose run --rm frontend npm install
docker-compose run --rm frontend npm run build
docker-compose up -d --build
