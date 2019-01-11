#!/usr/bin/env bash
kubectl apply -f ./Ingress/ingress.yml
kubectl apply -f ./API/api-service.yml
kubectl apply -f ./API/api-deployment.yml
kubectl apply -f ./Frontend/frontend-service.yml
kubectl apply -f ./Frontend/frontend-deploy.yml
