FROM google/cloud-sdk:alpine

MAINTAINER James Smith <james.smith@heig-vd.ch>

RUN mkdir -p /database

WORKDIR /database

ADD dataBase/dumpDBProd.agz ./
ADD gc-key.json ./
ADD initGCE.sh ./

CMD ["sh"]