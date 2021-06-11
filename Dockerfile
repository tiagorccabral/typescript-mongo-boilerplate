FROM node:14.16.0-alpine3.10

RUN mkdir -p /home/app && chown -R node:node /home/app
RUN apk add --no-cache bash

# Creates the work directory for the project
WORKDIR /home/app

COPY package.json yarn.lock ./

COPY init.sh ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000
