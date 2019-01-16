#!/usr/bin/env bash

# Using docker to connect to our kubernetes on google cloud
docker-compose build --no-cache
docker-compose up --build
