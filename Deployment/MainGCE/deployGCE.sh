source .env

# gcloud config account
gcloud init

gcloud projects create ${GC_PROJECT_NAME_FOODLOCAL} --name = ${GC_PROJECT_NAME_FOODLOCAL} --set-as-default

gcloud iam service-accounts keys create
gcloud auth activate-service-account --key-file=
gcloud components install kubectl
gcloud container clusters create ${GC_CLUSTER_ID_FOODLOCAL}

gcloud config set project ${GC_PROJECT_ID_FOODLOCAL}
gcloud config set compute/zone ${GC_ZONE_FOODLOCAL}

gcloud container clusters get-credentials ${GC_CLUSTER_ID_FOODLOCAL} --zone ${GC_ZONE_FOODLOCAL} --project ${GC_PROJECT_NAME_FOODLOCAL}

