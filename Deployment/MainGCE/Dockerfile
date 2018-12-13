FROM google/cloud-sdk:alpine

MAINTAINER James Smith <james.smith@heig-vd.ch>

RUN mkdir /deploy

WORKDIR /deploy

ADD deployGCE.sh .env

CMD [ "sh", "deployGCE.sh" ]