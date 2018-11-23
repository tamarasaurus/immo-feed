#!/bin/bash

docker-compose exec postgres psql -U postgres postgres -c '\pset pager off' -c "drop table results"
docker-compose exec redis redis-cli FLUSHALL
docker-compose restart api
