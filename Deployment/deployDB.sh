#!/usr/bin/env bash
kubectl apply -f ./DB/db-mongo-storage.yml
kubectl apply -f ./DB/db-clusterRoleBinding.yml
kubectl apply -f ./DB/db-mongo-service.yml
kubectl apply -f ./DB/db-mongo-statefulset.yml