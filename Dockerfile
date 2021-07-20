FROM node:14 AS base

WORKDIR /app

FROM base AS dependencies

COPY package*.json ./

RUN apt install chromium
RUN npm install

WORKDIR /app

COPY index.js /app
COPY .env /app

USER node
EXPOSE 3000

CMD [ "npm","run","start" ]