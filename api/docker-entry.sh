#!/bin/sh

host="$1"
port="$2"

until $(nc -z $host $port); do
  sleep 2
done

 npx sequelize db:migrate
# npx  sequelize db:seed:all
