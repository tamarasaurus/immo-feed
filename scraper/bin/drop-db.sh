#!/usr/bin/env sh

docker-compose exec mongo mongo immo-feed --eval "printjson(db.dropDatabase())"
