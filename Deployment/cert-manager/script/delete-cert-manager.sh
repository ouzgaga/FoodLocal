# Delete
helm del --purge cert-manager
kubectl get customresourcedefinition
kubectl delete customresourcedefinition certificates.certmanager.k8s.io clusterissuers.certmanager.k8s.io issuers.certmanager.k8s.io