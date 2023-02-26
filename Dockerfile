FROM node:19

ENV NODE_ENV="development"

WORKDIR /src
COPY package.json/ ./src/
