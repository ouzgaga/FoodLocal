# Use latest node version
FROM node:8.15.0-jessie

MAINTAINER Benoît Schopfer <benoit.schopfer@heig-vd.ch.ch>

# create api directory in container
RUN mkdir -p /api

# set /api directory as default working directory
WORKDIR /api

# only copy package.json initially so that it's recreated only
# if there are changes in package.json
ADD package.json ./

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#RUN npm install
# If you are building your code for production
#RUN apk update
#RUN apk --no-cache add --virtual builds-deps build-base python
#RUN npm config set python /usr/bin/python
#RUN npm install --only=production
#RUN npm rebuild bcrypt --build-from-source
#RUN apk del builds-deps

# copy all file from current dir to /api in container
COPY . /api/

# expose port 4040
EXPOSE 4040

# cmd to start service
CMD [ "npm", "start" ]
