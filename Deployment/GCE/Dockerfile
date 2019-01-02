FROM gce_foodlocal

MAINTAINER James Smith <james.smith@heig-vd.ch>

ADD kubectlCmd.sh ./
ADD ../DB ./
ADD ../Frontend ./
ADD ../API ./
ADD ../Ingress ./
ADD ../cert-manager ./

CMD ["sh","kubectlCmd.sh"]
