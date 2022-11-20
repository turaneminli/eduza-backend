#!/bin/bash
  
git pull origin master
docker kill $(docker ps -q)
docker build -t backend .
docker run -p 80:80 backend                         