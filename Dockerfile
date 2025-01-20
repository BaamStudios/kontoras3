FROM debian:latest
WORKDIR /
ADD https://github.com/BaamStudios/kontoras3/releases/latest/download/kontoras3_bin /kontoras3_bin
RUN chmod 777 /kontoras3_bin
EXPOSE 6400
ENTRYPOINT ["/bin/sh"]
