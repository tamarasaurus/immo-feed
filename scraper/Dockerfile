FROM node:latest

WORKDIR /usr/src/app
COPY scraper/package*.json ./

RUN npm install
COPY scraper .

EXPOSE 3000

RUN npm start
RUN npm run serve
