# Base image
FROM node:21.5-alpine3.18

# Install app dependencies
RUN npm i -g @angular/cli

# Ajoutez ceci à votre Dockerfile
RUN apk add --no-cache \
  chromium \
  xvfb \
  udev \
  ttf-freefont \
  fontconfig \
  && ln -s /usr/bin/chromium-browser /usr/bin/chrome


# Définir CHROME_BIN pour headless Chromium
ENV CHROME_BIN="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

ENV DISPLAY=:99


# Set user
USER node

# Create app directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

ENTRYPOINT npm install && npm run start:docker

