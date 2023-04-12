FROM node:15.4.0-alpine

WORKDIR '/app'

COPY package*.json ./
RUN npm install --production
COPY . .
ENTRYPOINT ["sh","./docker-entrypoint.sh"]
CMD ["npm", "run", "start:prod"]
