# Deployment

We choose to deploy our application across continuous integration with Gitlab.  All the processus is defined in the file: [.gitlab-ci.yml](../.gitlab-ci.yml). 



## Continuous Integration (CI)

The CI are split in different stages.

### Stages

- build
  - Build the apps into a Docker container
  - This stage is made to be sure that the apps can be built
- test
  - Run the tests of the apps
- release
  - Create and push an image of the app on Google Cloud Image Registery
- deploy
  - Deploy the apps on Google Cloud Kubernetes



## Continuous Deployment (CD)

### Google Cloud with Kubernetes

We choose to use Google Cloud with Kubernetes to host our applications. 

The procedure to follow to be able to redeploy the application on a same infrastructure is :

- Create a Google account on :  [Google SignUp](https://accounts.google.com/signup/v2/webcreateaccount?flowName=GlifWebSignIn&flowEntry=SignUp)
- Create a new project :
  - In the console interface (web page), click on *select project* , then on *new project*.
  - Enter your project name and select the zone (not necessary) that you want for the project.
- Create a [account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys#iam-service-account-keys-create-console) :
  - In the search bar of Google Cloud, search for *IAM and administration*
    - Click on the *service account*  subMenu.
    - Create or select the account for which you want to generate the access key.
      - If you create it, select the role *owner of the project*
      - They will ask you if you want to generate a new key. Click on the button to do so and then select the JSON format.
      - Then, save it at the right place :
        - In the [Deployment/DB/script](./DB/script) folder (Not necessary but usefull script to deploy a db)
        - You will need to add a environment variable into Gitlab.
          - Name it `GC_KEY` and give it the content of the json file as value.
        - If you use the Google Cloud SDK in local, you will need this file to connect in a easier way.
        - Everytime you will create a docker container, insert this file inside of the docker image. 
- Create a [Kubernetes cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-cluster) (please read officiel doc for more information or how to do it by the terminal)
  - From the web interface, search for `Kubernetes Engine`
  - You will need to subscribe to the trial version of Google Cloud (with 300$ and one year free)
  - Click on *create new cluster*
    - You will need to choose the name, zone etc
      - We will need this informations to connect to the cluster via the terminal
        - In the folder : [Deployment/DB/script](./DB/script/), create a .env file with the same structure as the .env.default and insert the correct informations into it.
        - Do the same for the folder [Deployment/GCE](./GCE/)
        - Add the environment variable into Gitlab to use the CI.
      - *Tips*: If you click on `login` (`se connecter` in french), you will see the line to use to connect from the terminal.
- Connect to the Kluster with Kubectl
- Install [Helm/Tiller](#helmtiller)
- Install the [nginx-ingress loadbalancer](#install-nginx-ingress)
- Install the [cert-manager](#install-cert-manager)
- Install the [database](#install-mongodb-database)
- Deploy the different [services and deployment](#install-services-and-deployment)



## Install

### Kubectl and Google Cloud SDK

You have to choices : Install the Google Cloud SDK and Kubectl in local or use a docker container.

To install it in local please follow the official documentation:

- [SDK](https://cloud.google.com/sdk/install)
- [Kubectl](https://cloud.google.com/kubernetes-engine/docs/quickstart)

The image to use to have the SDK installed is `google/cloud-sdk:alpine`. In this image, you will need to install Kubectl. You can do so with the following command : 

```sh
gcloud components install kubectl
```

To authentificate to your project, use the following command with the account key in the same folder:

```sh
gcloud auth activate-service-account --key-file=./gc-key.json
```

To define in witch kubernetes cluster you will work use this command :

```sh
gcloud container clusters get-credentials $GC_CLUSTER_ID --zone $GC_ZONE --project $GC_PROJECT_ID
```

Don't forget to replace the `GC_CLUSTER_ID`, `GCE_ZONE` and `GCE_PROJECT_ID` with your own values!



### Helm/Tiller

#### Definition

Helm and Tiller is a package manager for Kubernetes.

#### Installation

To install them, please follow the official documentation: https://docs.helm.sh/using_helm/

## Install nginx-ingress

### Reason

We have to deploy a `nginx-ingress` loadbalancer to handle the http to https redirection. `GCE loadbalancer` do not handle this.
Source : https://medium.com/google-cloud/google-cloud-platform-redirecting-http-traffic-to-https-f63c1d7dbc6d

### Install

To install `nginx-ingress`, we used helm.

```bash
helm install --name nginx-ingress --set \ controller.service.loadBalancerIP="<staticIP>" stable/nginx-ingress
```

Where `staticIP` is a static IP address reserved on the same region of the cluster.

To reserve an staticIP in the web interface, search for `IP` -> `extern IP address`-> `Reserve an static address ip` in the search bar.

Install your `ingress configuration `:

```bash
kubectl apply -f ingress.yml
```



## Install Cert-Manager

All the scripts for the cert-manager are in this folder [./cert-manager/script/](./cert-manager/script/)

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
  
  temp
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

- Deploy `ClusterIssuer` and `Certificate`

  `deploy-cert-manager.sh`

  ```bash
  # Deploying Certificate Manager
  kubectl apply -f ../certmanager.yml -n cert-manager
  
  # Deploying Certificate
  kubectl apply -f ../certificate.yml
  ```

### Install MongoDB Database

We choose to install a replica set for ensure the accessibility of our data.

To do so, we used Helm and a configuration file : [values-production.yaml](./DB/values-production.yaml)

- To deploy a DB, you can run the docker script [deployDB.sh](./deployDB.sh) or go into the [Deployment/DB](./DB) folder and run :

  ```sh
  helm install --name foodlocal-db -f ./values-production.yaml stable/mongodb-replicaset
  ```

- To test if the replica set work correctly, there is a test [script](./DB/testReplicaset.sh) in the DB folder.

### Install services and deployment

The easiest way to install services and deployment is to run the [deployAllServicesAndDeployment.sh](.deployAllServicesAndDeployment.sh) script.

The services are deployed in the following order :

- Ingress
  - [ingress.yml](./Ingress/ingress.yml)
    - Loadbalancer and rules of redirection
- API
  - [API Secret](./API/api-secret.yml.default)
    - Create a new file *api-secret.yml* with your own environment variables.
  - [API Service](./API/api-service.yml)
    - Manage the api deployments.
  - [API Deployment](./API/api-deployment.yml)
    - Set the specification of the api deployment.
    - You will need to have the image of your api into Google Cloud Image Registery.
      - Best way to do so is to pass by the *gitlab-ci* or using *docker login.*
        - To see an example for docker login please read the [.gitlab-ci.yml](../.gitlab-ci.yml) in the `release image` section.
- Frontend
  - [Frontend Service](./Frontend/frontend-service.yml)
    - Manage the frontend deployments.
  - [Frontend Deployment](./Frontend/frontend-deploy.yml)
    - Set the specification of the frontend deployment.
    - You will need to have the image of your frontend into Google Cloud Image Registery.
      - Best way to do so is to pass by the *gitlab-ci* or using *docker login.*
        - To see an example for docker login please read the [.gitlab-ci.yml](../.gitlab-ci.yml) in the `release image`  section.

### Auto-scale of deployments

To auto-scale a deployment you can do:

```sh
kubectl autoscale deployment frontend-deploy --max <max> --min <min> --cpu-percent <cpu-percent>
```

## Other Scripts

### Remove deployments

To remove all deployments use the script : [deleteAllServicesAndDeployment.sh](./deleteAllServicesAndDeployment.sh)

## Tips

### Connect to a pod

```sh
kubect exec -it <pod-name> sh
```

### Get logs from a pod

```sh
kubectl logs <pod-name>
```

### Get resource names and small info

```sh
kubectl get <resource>
```

Resources can be :

- pods
- deployments
- services
- etc...

### Get info from a pod

```sh
kubectl describe <ressource> <ressource-name>
```

## Source

- Authorization : https://cloud.google.com/sdk/docs/authorizing
- Create Project : https://cloud.google.com/sdk/gcloud/reference/projects/create
- Getting Google Cloud Account Key: https://cloud.google.com/iam/docs/creating-managing-service-account-keys
- MongoDB replica set : https://github.com/helm/charts/tree/master/stable/mongodb-replicaset

