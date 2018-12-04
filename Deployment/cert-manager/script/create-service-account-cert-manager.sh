NAME=cert-manager-service-account
PROJECT=foodlocal-218406
KEY=cert-key.json

#Creating a namespace
kubectl create namespace cert-manager
#Creating a service-account for the project
gcloud iam service-accounts create ${NAME} --display-name=${NAME} --project=${PROJECT}
#Creating the key (json file) to certifie we own this project
gcloud iam service-accounts keys create ../${KEY} --iam-account=${NAME}@${PROJECT}.iam.gserviceaccount.com --project=${PROJECT}
#Adding right to the service account
gcloud projects add-iam-policy-binding ${PROJECT} --member=serviceAccount:${NAME}@${PROJECT}.iam.gserviceaccount.com --role=roles/owner
# Creating a Secret for the cert-manager
kubectl create secret generic ${NAME} --from-file=../${KEY} --namespace=cert-manager

# Note: The key (cert-key.json) will be generate in the parent folder to be seen by the certmanager.yml
