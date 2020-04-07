const path = require('path');

// Load .env file
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const express = require('express');
const { sequelize } = require('./models');
const passport = require('./config/passport');
const { auth, chart, cluster, dashboard, query, queryParam, user } = require('./routes');

const { PORT, NODE_PORT } = process.env;
const port = PORT || NODE_PORT;

const app = express();

// Enable middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize and set strategy for Passport
app.use(passport.initialize());
passport.jwtStrategy();

// Routes
app.use('/api/auth', auth);
app.use('/api/chart', passport.authenticate(), chart);
app.use('/api/cluster', passport.authenticate(), cluster);
app.use('/api/dashboard', passport.authenticate(), dashboard);
app.use('/api/param', passport.authenticate(), queryParam);
app.use('/api/query', passport.authenticate(), query);
app.use('/api/user', passport.authenticate(), user);

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => console.log(`Server listening on port ${port}.`));
  })
  .catch(err => console.error(err));
