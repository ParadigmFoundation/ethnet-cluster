#!/usr/bin/env bash

IMAGE_HOST=$1
IMAGE_NAME=$2
IMAGE_TAG=$3

PUBLISH=$4

VERSION_TAG="$IMAGE_HOST/$IMAGE_NAME:$IMAGE_TAG"
LATEST_TAG="$IMAGE_HOST/$IMAGE_NAME:latest"

# build and tag new healthcheck image
docker build \
    -t $VERSION_TAG \
    -t $LATEST_TAG \
    -f ./health-checker/Dockerfile \
    .

# push new image to registry (if supplied as argv 4)
if [ $PUBLISH = "true" ]
then
    docker push $VERSION_TAG
    docker push $LATEST_TAG
fi

exit 0
