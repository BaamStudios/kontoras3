FROM node:current-alpine
WORKDIR /app
ADD https://github.com/BaamStudios/kontoras3/releases/latest/download/schuetze.zip /app

RUN apk add --no-cache --upgrade bash && \
    apk add zip unzip

EXPOSE 6400
ENTRYPOINT ["/bin/sh"]
