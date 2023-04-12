FROM nginx:1.19.5-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/realbi.conf.template /etc/nginx/conf.d/realbi.conf.template

# Remove default.conf to avoid duplication error of listening port of host
RUN rm /etc/nginx/conf.d/default.conf

COPY certs/ /etc/nginx/certs

COPY run_nginx.sh /etc/nginx/run_nginx.sh
RUN ["chmod", "+x", "/etc/nginx/run_nginx.sh"]
