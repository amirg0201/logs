# !/bin/bash
set -e

echo $ACCOUNT_KEY > ${HOME}/logs/gcloud-service-key.json

gcloud auth activate-service-account ${ACCOUNT_ID} --key-file ${HOME}/logs/gcloud-service-key.json

gcloud --quiet config set project ${PROJECT_ID}
gcloud --quiet config set container/cluster ${CLUSTER_NAME}
gcloud --quiet container clusters get-credentials ${CLUSTER_NAME}

echo "Deployment: $DEPLOYMENT - ${CONTAINER}"
kubectl set image deployment/${DEPLOYMENT} ${CONTAINER}=${CLOUDSDK_COMPUTE_ZONE}-docker.pkg.dev/${PROJECT_ID}/${CONTAINER}/${CIRCLE_SHA1}:${CIRCLE_SHA1}
