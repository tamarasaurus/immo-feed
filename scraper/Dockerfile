FROM node:9-slim
WORKDIR /usr/src/app
ENV PATH=node_modules/.bin:$PATH

RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update && apt-get install -yq --no-install-recommends libgconf-2-4 google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont

COPY scraper/package*.json ./
RUN npm install
COPY scraper .
RUN npm run build
