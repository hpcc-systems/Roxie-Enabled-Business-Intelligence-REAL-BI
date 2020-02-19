# HPCC Dashboard

## Installation

1. Run `git clone https://gitlab.ins.risk.regn.net/HumaCh01/hpccdashboard.git`
2. Copy `.env.example` file and rename the copied file to `.env`
3. Fill in `.env` values
4. Create database in MySQL server that matches the database name provided in `.env`
5. Navigate to the following directories and run install commands
   - `root` directory -> `npm install`
   - `server` directory -> `npm install`
   - `client` directory -> `npm install`
6. Navigate to the `root` directory and run command `npm run start`
7. Navigate to `server` directory and run command `npm run seed`
8. Application should be accessible at http://localhost:3000
