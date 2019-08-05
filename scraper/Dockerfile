FROM node:10-slim
WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get --no-install-recommends --no-install-suggests --yes --quiet install \
            fonts-liberation gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 \
            libdbus-1-3 libexpat1 libfontconfig1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 \
            libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
            libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
            libappindicator1 libnss3 lsb-release xdg-utils python make g++ gcc libstdc++ \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get --no-install-recommends --no-install-suggests --yes --quiet install \
            google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
    && apt-get clean && apt-get --yes --quiet autoremove --purge \
    && rm -rf  /var/lib/apt/lists/* /tmp/* /var/tmp/* \
            /usr/share/doc/* /usr/share/groff/* /usr/share/info/* /usr/share/linda/* \
            /usr/share/lintian/* /usr/share/locale/* /usr/share/man/*

COPY ./scraper .
