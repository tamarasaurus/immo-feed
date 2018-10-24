#!/bin/bash

docker-compose exec mongo mongo immo-feed --eval "printjson(db.dropDatabase())"
docker-compose exec redis redis-cli FLUSHALL
