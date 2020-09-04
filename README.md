# REAL BI

Real BI is a tool used to connect to [HPCC](https://hpccsystems.com/) and create visualizations from the data stored in the clusters. The visualizations can be powered by the output from ROXIE queries, logical files, or custom executed ECL scripts.

### Installation

1. Run `git clone https://github.com/hpcc-systems/REAL-BI.git`
2. Rename the **_.env.example_** file to **_.env_** and fill in the remaining values.
3. Run `npm install`.
4. Run `docker-compose up --build`.

### Production

1. In the **_docker-compose.yml_** file:
   - Comment out the `Dockerfile.dev` references and comment in the `Dockerfile` references.
2. In the **_.env_** file:
   - Change the `NODE_ENV` value to "production".
   - Change the database information to point to your production database.

### Notes

- This application relies on:
  - A running instance of [Auth Service](https://github.com/hpcc-systems/Auth-Service) to handle authentication and JWT generation.
  - An HPCC cluster containing data files.
- This application uses docker-compose to simultaneously start multiple containers:
  - MySQL Database
  - Backend API Server
  - Frontend Web UI
  - Nginx Web Server
