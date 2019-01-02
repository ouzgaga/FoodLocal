FROM google/cloud-sdk:alpine

MAINTAINER James Smith <james.smith@heig-vd.ch>

ARG GC_CLUSTER_ID
ARG GC_ZONE
ARG GC_PROJECT_ID

RUN mkdir -p /database

WORKDIR /database

ADD gc-key.json ./
ADD initGCE.sh ./

RUN ["sh","initGCE.sh"]

# Cmd to lunch in the kubernetes cluster (need to added by script or copy/paste)
# CMD ["sh", "./tmp/kubectlCmd.sh"]

