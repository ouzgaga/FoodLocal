#!/usr/bin/env bash

# Using docker to connect to our kubernetes on google cloud
docker build -t gce_foodlocal:latest ./../../Docker/
docker build -t gce_kubectl .
rm ./../../Docker/tmp/kubectlCmd.sh # remove old script
cp kubectlCmd.sh ./../../Docker/tmp/kubectlCmd.sh # copy new script
cd ./../../Docker/ # go into the tmp containing docker
docker-compose up --build
