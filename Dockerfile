FROM node:current-alpine
WORKDIR /app

RUN apk add --no-cache --upgrade bash && \
    apk add zip unzip

ADD https://github.com/BaamStudios/kontoras3/releases/latest/download/schuetze.zip /app
# RUN chown node: /app/schuetze.zip
# RUN chown node: /app
# USER node
RUN unzip schuetze.zip
RUN npm install --omit dev
RUN ln -s /app/dist /dist
EXPOSE 6002
ENTRYPOINT ["npm", "start"]
