# Deployment

## CI

### Stages

- build
  - Building the apps into a Docker container
- test
  - Running the test of the apps
- release
  - Creating a realeasable container
- deploy
  - Deploying the apps on google cloud

## CD

`Notice: you can found all the script in the folder ./script` 

### Install Helm/Tiller

#### Definition

Helm and Tiller is a package manager for Kubernetes.

#### Installation

To install them, please follow the official documentation: https://docs.helm.sh/using_helm/

## Install Cert-Manager

You can find all scripts to install, update, remove in the folder `./script`

- Create a `service-account` (good practice)

  `create-service-account-cert-manager.sh`

  ```bash
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
  ```

  - `NAME` is the name of the service-account we will create
  - `PROJECT` is the project to bind with the cert-manager
  - `KEY`  is the name of the json containing the validation of owning the project will be created

- Installing cert-manager

  `install-cert-manager.sh`

  ```bash
  # Install
  helm install --name cert-manager --namespace cert-manager stable/cert-manager --set ingressShim.defaultIssuerName=letsencrypt --set ingressShim.defaultIssuerKind=ClusterIssuer
  ```

  - Need to install a ClusterIssuer and not a Issuer because we are not in the same namespace as our ingress.

- Deploying `ClusterIssuer` and `Certificate`

  `deploy-cert-manager.sh`

  ```bash
  # Deploying Certificate Manager
  kubectl apply -f ../certmanager.yml -n cert-manager
  
  # Deploying Certificate
  kubectl apply -f ../certificate.yml
  ```

## Other Scripts

// To Do