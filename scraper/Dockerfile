FROM node:9-slim as npm
WORKDIR /usr/src/app
ENV PATH=node_modules/.bin:$PATH
COPY scraper/package*.json ./
RUN npm install
COPY scraper .
RUN npm run build
