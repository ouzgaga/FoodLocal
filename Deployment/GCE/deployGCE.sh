#!/usr/bin/env bash

# Using docker to connect to our kubernetes on google cloud
docker build -t gce_foodlocal ./../../Docker/Dockerfile
docker build -t gce_kubectl .
rm ./../Docker/tmp/kubectlCmd.sh
cp kubectlCmd.sh ./../../Docker/tmp/kubectlCmd.sh
cd ./../../Docker/ # go into the tmp containing docker
docker-compose up --build