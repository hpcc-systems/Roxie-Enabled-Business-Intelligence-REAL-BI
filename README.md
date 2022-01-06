# REAL BI

![](/client/public/docs/realbidemo.jpg)

Real BI is a tool used to connect to [HPCC](https://hpccsystems.com/) and create visualizations from the data stored in the clusters. The visualizations can be powered by the output from ROXIE queries, logical files, or custom executed ECL scripts.

---

## Installation

### Development

## Running Application on Local Machine

1. Run `git clone https://github.com/hpcc-systems/REAL-BI.git` to copy the project into your computer.
2. You will need to intall dependencies for a project. While in a root folder run command `npm install`, it will install npm packages in root as well as `/api` and `/client` folders.
3. In the root folder, rename the **_.env.example_** file to **_.env_** and fill in the empty values. You can find an explanation inside **_.env.example_** .
4. In `/client` rename the **_.env.example_** file to **_.env.development_** and fill in the empty values. You can find explanation inside **_.env.example_** .
5. Create `real_bi` schema in your local MySQL database.
6. Go to `/api` and run `npx sequelize db:migrate` to build database tables.
7. Add a cluster to the seed file in order to create a dashboard. The cluster should be publicly available. A sample seed file is provided **_api\src\seeders\cluster-example.js_**.
8. Go to `/api` and run `npx sequelize db:seed:all` to populate the database with seed cluster.
9. Navigate to the root folder and run `npm start` it will start the server and client application at the same time.
10. Navigate to http://localhost:3000/ to start using an application.

### Production

## To run app in Docker Container -->

1. Run `git clone https://github.com/hpcc-systems/REAL-BI.git`
2. In the **_.env_** file:
   - Change the `NODE_ENV` value to "production".
   - Change the database information to point to your production database.
3. Rename the **_.env.example_** file to **_.env_** and fill in the empty values.You can find explanation inside **_.env.example_** .
4. To use SSL certificates add cert and key files to `/nginx/certs`.
5. Update file `/nginx/conf.d/realbi.conf.template` to match cert and key file names.
6. Run `docker-compose up --build -d` to create and run the containers.

## SSL with Letsencrypt and Certbot container

### To generate an SSL certificate we use Certbot Docker image, to learn more please visit https://eff-certbot.readthedocs.io/en/stable/install.html#running-with-docker

### Learn more about Letsencrypt https://letsencrypt.org/

### Good article (guide) on how to use NGINX with Certbot in Docker https://pentacent.medium.com/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71

1. Add Certbot container to your `docker-compose.yml` file;

```certbot:
    container_name: certbot
    env_file:
      - .env
    networks:
      - realbi_network
    depends_on:
      - nginx
    image: certbot/certbot:latest
    command: certonly --webroot --webroot-path=<Path to acme challenge inside container> --email <Your email> --agree-tos --no-eff-email -d <Your domain>
    volumes:
      - <Path to certs on local machine>:<Path to certs inside container>
      - <Path to acme-challenge on local machine>:<Path to acme-challenge inside container>
```

2.  Add a shared volume to your Nginx container (volume should be the same for Certbot container)

```
    volumes:
      - <Path to certs on local machine>:<Path to certs inside container>
      - <Path to acme challenge on local machine>:<Path to acme challenge inside container>
```

3. Go to `nginx\conf.d\realbi.conf.template` and update the config to run without SSL first by commenting out SSL related settings

```
server {
 # listen $EXTERNAL_HTTPS_PORT ssl;
 listen $EXTERNAL_HTTP_PORT;
 server_name $HOST_HOSTNAME;

 # ssl_certificate <Path to cert>;
 # ssl_certificate_key <Path to key>;

```

4. In `nginx\conf.d\realbi.conf.template` define new location for acme challenge

```
  location /.well-known/acme-challenge/ {
    root <Path to acme challenge inside container>;
  }
```

5. Make sure that port 80 is open and the app is reachable over the web.

6. Stop and remove the old Nginx container, then run `docker-compose up -d --no-deps --build nginx certbot`

- Nginx will be listening and serving acme-challenge from a shared volume with Certbot container.
  To insure that certbot succeeds, check `docker logs certbot` .

7. Update Nginx configuration to run with a new certificate. Go to `nginx\conf.d\realbi.conf.template` and update SSL path, ex.

```
server {
 listen $EXTERNAL_HTTPS_PORT ssl;
 server_name $HOST_HOSTNAME;
 ssl_certificate <Path to certs inside container>/live/<Your domain>/fullchain.pem;
 ssl_certificate_key <Path to certs inside container>/live/<Your domain>/privkey.pem;
```

8. Rebuild Nginx container `docker-compose up -d --no-deps --build nginx`

---

## Notes

- This application relies on:
  - A running instance of [Auth Service](https://github.com/hpcc-systems/Auth-Service) to handle user authentication and JWT generation.
  - Application can use Microsoft Active Directory for authentication and authorization
  - An HPCC cluster containing data files.
- This application uses docker-compose to simultaneously start multiple containers:
  - MySQL Database
  - Backend Node.js API Server
  - Frontend React.js Web UI
  - Nginx Proxy Web Server
