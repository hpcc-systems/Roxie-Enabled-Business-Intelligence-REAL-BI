FROM node:14.9.0-alpine as builder

WORKDIR '/app'

COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build


FROM nginx:1.19.1

EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
