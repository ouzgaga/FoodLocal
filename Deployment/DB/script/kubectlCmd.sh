#!/usr/bin/env bash

kubectl exec mongo-0 -- rm -r dumpDBProd.agz
kubectl exec mongo-0 -- mongo api_foodlocal_production --eval "db.dropDatabase()"
kubectl exec mongo-0 -- mongo api_foodlocal_dev --eval "db.dropDatabase()"
kubectl exec mongo-0 -- mongo api_foodlocal_test --eval "db.dropDatabase()"
kubectl cp dumpDBProd.agz mongo-0:/dumpDBProd.agz
kubectl exec mongo-0 -- mongorestore --verbose --gzip --archive=/dumpDBProd.agz
