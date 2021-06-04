#!/bin/bash

docker-compose run --rm scraper npm install
docker-compose run --rm api npm install
docker-compose up -d --build