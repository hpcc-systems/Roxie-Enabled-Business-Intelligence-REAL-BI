#!/bin/sh

hostname="$1"
export HOSTNAME=$hostname
export DOLLAR='$'
envsubst < /etc/nginx/conf.d/realbi.conf.template > /etc/nginx/conf.d/realbi.conf
nginx -g "daemon off;"
