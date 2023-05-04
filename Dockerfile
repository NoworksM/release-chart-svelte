FROM node:20-alpine3.16
WORKDIR /app

COPY package.json ./
COPY packag-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

RUN node ./build/index.js
