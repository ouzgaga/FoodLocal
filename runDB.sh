kubectl apply -f db-mongo-storage.yml
kubectl apply -f db-clusterRoleBinding.yml
kubectl apply -f db-mongo-service.yml
kubectl apply -f db-mongo-statefulset.yml