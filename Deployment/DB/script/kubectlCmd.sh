#!/usr/bin/env bash

env # show the env variables

# Create the connection with the google cloud account
gcloud components install kubectl
gcloud auth activate-service-account --key-file=./gc-key.json # put your gc-key into the same directory
gcloud container clusters get-credentials $GC_CLUSTER_ID --zone $GC_ZONE --project $GC_PROJECT_ID # will take the information from the .env in the same directory

# Run the kubectl cmd to change the db with the db into the folder dataBase
kubectl exec foodlocal-db-mongodb-replicaset-2 -- rm -r /tmp/dumpDBProd.agz
kubectl exec foodlocal-db-mongodb-replicaset-2 -- mongo api_foodlocal_production --eval "db.dropDatabase()"
kubectl exec foodlocal-db-mongodb-replicaset-2 -- mongo api_foodlocal_dev --eval "db.dropDatabase()"
kubectl exec foodlocal-db-mongodb-replicaset-2 -- mongo api_foodlocal_test --eval "db.dropDatabase()"

kubectl cp dumpDBProd.agz foodlocal-db-mongodb-replicaset-2:/tmp/dumpDBProd.agz
kubectl exec foodlocal-db-mongodb-replicaset-2 -- mongorestore --verbose --gzip --archive=/tmp/dumpDBProd.agz
