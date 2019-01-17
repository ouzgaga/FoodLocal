FROM google/cloud-sdk:alpine

MAINTAINER James Smith <james.smith@heig-vd.ch>

ARG GC_CLUSTER_ID
ARG GC_ZONE
ARG GC_PROJECT_ID

ADD gc-key.json ./
ADD kubectlCmd.sh ./
ADD ./dataBase/dumpDBProd.agz ./

ENTRYPOINT ["sh","kubectlCmd.sh"]