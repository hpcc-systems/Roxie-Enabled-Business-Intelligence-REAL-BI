# REAL BI

Real BI is a tool used to connect to [HPCC](https://hpccsystems.com/) and create visualizations from the data stored in the clusters. The visualizations can be powered by the output from ROXIE queries, logical files, or custom executed ECL scripts.

---

## Installation

### Development

## Running Application on Local Machine

1. Run `git clone https://github.com/hpcc-systems/REAL-BI.git` to copy project into your computer.
2. Rename the **_.env.example_** file to **_.env_** and fill in the empty values. You can find explenation inside **_.env.example_** .
3. Install npm packages:
   - Run `npm install` in root folder
   - go to `/api` run `npm install`.
   - go to `/client` run `npm install`.
4. In `/client` rename the **_.env.example_** file to **_.env.development_** and fill in the empty values. You can find explenation inside **_.env.example_** .

5. Create `real_bi` schema in your local MySQL database.
6. Go to `/api` and run `npx sequelize db:migrate` to build database tables.
7. At least one cluster will need to be added to the database to begin making dashboards. A sample seed file is provided in **_api/src/seeders_**.
   **_api\src\seeders\cluster-example.js_** add existing cluster info.
8. Go to `/api` and run `npx sequelize db:seed:all` when in
9. Navigate to root folder and run `npm start` it will start the server and client application at the same time.
10. Navigate to http://localhost:3000/

### Production

## To run app in Docker Contianer -->

1. Run `git clone https://github.com/hpcc-systems/REAL-BI.git`
2. In the **_.env_** file:
   - Change the `NODE_ENV` value to "production".
   - Change the database information to point to your production database.
3. Rename the **_.env.example_** file to **_.env_** and fill in the empty values.You can find explenation inside **_.env.example_** .
4. Add cert and key files to `/nginx/certs`.
5. Update lines #22 and #23 in `/nginx/conf.d/realbi.dev.conf.template` to match cert and key file names.
6. Run `docker-compose up --build -d`.
7. After all containers are started, run `docker restart realbi_api`.
   - This is done because the server starts before the database is ready to accept connections even with the api container depending on the db container.

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
