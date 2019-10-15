#!/bin/bash

cd scraper && npm install && cd ../
cd api && npm install && cd ../
cd frontend && npm install && npm run build && ci ../
docker-compose up -d --build
