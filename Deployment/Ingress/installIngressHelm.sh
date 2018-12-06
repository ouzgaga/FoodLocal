helm install --name nginx-ingress --set controller.service.loadBalancerIP="35.187.114.227" stable/nginx-ingress
kubectl apply -f ingress.yml
