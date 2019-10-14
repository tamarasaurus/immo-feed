#!/bin/bash

cd scraper && npm install && cd ../
cd api && npm install && cd ../
docker-compose up -d --build
