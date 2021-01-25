FROM node:14.15.4-alpine3.10

RUN mkdir -p /home/node-typescript-starter && chown -R node:node /home/node-typescript-starter
RUN apk add --no-cache bash

# Creates the work directory for the project
WORKDIR /home/node-typescript-starter

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000
