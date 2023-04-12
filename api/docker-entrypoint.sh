#!/bin/sh

npx sequelize db:migrate
npx  sequelize db:seed:all
npx sequelize db:migrate:status
npm run start:prod
