#!/usr/bin/env bash

# Deploy DB
kubectl apply -f ./DB/db-mongo-storage.yml
kubectl apply -f ./DB/db-clusterRoleBinding.yml
kubectl apply -f ./DB/db-mongo-service.yml
kubectl apply -f ./DB/db-mongo-statefulset.yml

# Ingress
kubectl apply -f ./Ingress/ingress.yml

# Backend (API)
kubectl apply -f ./API/api-service.yml
kubectl apply -f ./API/api-deployment.yml

# Frontend
kubectl apply -f ./Frontend/frontend-service.yml
kubectl apply -f ./Frontend/frontend-deploy.yml