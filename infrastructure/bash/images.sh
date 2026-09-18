# !/bin/bash
set -e

echo $ACCOUNT_KEY > ${HOME}/logs/gcloud-service-key.json

gcloud auth activate-service-account ${ACCOUNT_ID} --key-file ${HOME}/logs/gcloud-service-key.json
gcloud config set project ${PROJECT_ID}
gcloud auth configure-docker ${CLOUDSDK_COMPUTE_ZONE}-docker.pkg.dev --quiet

docker build -t ${CLOUDSDK_COMPUTE_ZONE}-docker.pkg.dev/${PROJECT_ID}/${CONTAINER}/${CIRCLE_SHA1}:latest .
docker push ${CLOUDSDK_COMPUTE_ZONE}-docker.pkg.dev/${PROJECT_ID}/${CONTAINER}/${CIRCLE_SHA1}:latest