#!/usr/bin/env bash

# Using docker to connect to our kubernetes on google cloud
docker-compose up --build gce
kubectl exec mongo-0 -- rm -r dumpDBProd.agz
kubectl exec mongo-0 -- mongo api_foodlocal_production --eval "db.dropDatabase()"
kubectl cp ./dataBase/dumpDBProd.agz mongo-0:dumpDBProd.agz
kubectl exec mongo-0 -- mongorestore --verbose --gzip --archive=/dumpDBProd.agz
