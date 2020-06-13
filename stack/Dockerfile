# The instructions for the first stage
FROM node:13-alpine as node-compiled

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

# dependecies for npm compiling
RUN apk --no-cache add python make g++

COPY package*.json ./
RUN npm install

# The instructions for second stage
FROM node:13-alpine

WORKDIR /usr/src/app
COPY . .
COPY --from=node-compiled node_modules node_modules

# EXPOSE 5000

CMD [ "npm", "run", "start" ]