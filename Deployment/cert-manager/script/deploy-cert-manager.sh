# Deploying Certificate Manager
kubectl apply -f ../certmanager.yml -n cert-manager

# Deploying Certificate
kubectl apply -f ../certificate.yml