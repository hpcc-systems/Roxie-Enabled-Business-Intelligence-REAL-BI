# REAL BI

## Installation

1. Run `git clone https://github.com/hpcc-systems/REAL-BI.git`
2. Navigate to the _root_ and _client_ directories and copy the **_.env.example_** files
3. Rename the copied files to **_.env_** and fill in the values
4. Create an empty database schema in MySQL server
   - **NOTE:** The database schema name must match the value provided in the _root_ **_.env_** file for the **_DB_NAME_** field.
5. Navigate to the _root_, _server_, and _client_ directories and run `npm install`
6. Navigate to the _root_ directory and run `npm run start`

## Notes

### Development Environment

1. Confirm that the **NODE_PORT** value in the _root_ **_.env_** matches the **proxy** address port in the _client_ directory **package.json**.
