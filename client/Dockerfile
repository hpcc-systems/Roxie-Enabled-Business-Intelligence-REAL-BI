FROM node:15.4.0-alpine as builder

WORKDIR '/app'

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:1.19.5-alpine

COPY ./nginx/conf.d /etc/nginx/conf.d

# Remove default.conf to avoid duplication error of listening port of host
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html
