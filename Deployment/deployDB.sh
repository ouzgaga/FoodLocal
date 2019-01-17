#!/usr/bin/env bash
cd ./DB
helm install --name foodlocal-db -f ./values-production.yaml stable/mongodb-replicaset