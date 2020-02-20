# HPCC Dashboard

## Installation

1. Run `git clone https://gitlab.ins.risk.regn.net/HumaCh01/hpccdashboard.git`
2. Navigate to the following directories and copy the `.env.example` files and rename the copies to `.env`
   - `root` directory
   - `client` directory
3. Fill in `.env` values
4. Create database in MySQL server that matches the database name provided in `.env`
5. Navigate to the following directories and run install commands
   - `root` directory -> `npm install`
   - `server` directory -> `npm install`
   - `client` directory -> `npm install`
6. Navigate to the `root` directory and run command `npm run start`
7. Navigate to `server` directory and run command `npm run seed`

## Notes

1. Before launching the application in development, confirm that the `NODE_PORT` value in the `root` directory `.env` matches the `proxy` address port in the `client` directory `package.json`.
