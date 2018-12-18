gcloud components install kubectl
gcloud auth activate-service-account --key-file=./gc-key.json
gcloud container clusters get-credentials $GC_CLUSTER_ID --zone $GC_ZONE --project $GC_PROJECT_ID
