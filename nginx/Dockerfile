FROM nginx:1.19.1

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/realbi.conf.template /etc/nginx/conf.d/realbi.conf.template

# Remove default.conf to avoid duplication error of listening port of host
RUN rm /etc/nginx/conf.d/default.conf

COPY certs/ /etc/nginx/certs

ENV HOSTNAME ${HOSTNAME}
ENV NODE_PORT ${NODE_PORT}
