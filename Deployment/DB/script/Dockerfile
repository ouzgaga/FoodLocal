FROM google/cloud-sdk:alpine

MAINTAINER James Smith <james.smith@heig-vd.ch>

ARG GC_CLUSTER_ID
ARG GC_ZONE
ARG GC_PROJECT_ID

RUN mkdir -p /database

WORKDIR /database

ADD dataBase/dumpDBProd.agz ./
ADD gc-key.json ./
ADD initGCE.sh ./
ADD kubectlCmd.sh ./

RUN ["sh","initGCE.sh"]

CMD ["sh", "kubectlCmd.sh"]