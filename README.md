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
5. Update lines #9 to #28 in `/nginx/conf.d/realbi.conf.template` to match cert and key file names.
6. Run `docker-compose up --build -d` to create and run the containers.

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
