FROM gce_foodlocal:latest

MAINTAINER James Smith <james.smith@heig-vd.ch>

ADD kubectlCmd.sh ./
ADD ./dataBase/dumpDBProd.agz ./

CMD ["sh","kubectlCmd.sh"]