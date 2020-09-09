FROM node:14.9.0-alpine

WORKDIR '/app'

COPY package*.json ./
RUN npm install --production
COPY . .

CMD ["npm", "start"]
