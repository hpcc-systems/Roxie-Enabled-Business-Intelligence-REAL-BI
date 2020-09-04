FROM node:14.5.0-alpine

WORKDIR '/app'

COPY package*.json ./
RUN npm install --production
COPY . .

CMD ["npm", "start"]
