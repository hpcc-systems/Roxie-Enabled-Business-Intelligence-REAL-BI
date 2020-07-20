# REAL BI

## Installation

1. Run `git clone https://github.com/hpcc-systems/REAL-BI.git`
2. Navigate to the _root_ and _client_ directories and copy the **_.env.example_** files
3. Rename the copied files to **_.env_** and fill in the values
4. Create an empty database schema in MySQL server
5. Navigate to the _root_ directory and run `npm run install:all` then `npm start`.

## Notes

- The database schema name must match the value provided in the _root_ **_.env_** file for the **_DB_NAME_** field.

### Development Environment

1. Confirm that the proxy address in `./client/src/setupProxy.js` points to the correct location of the running node server.
