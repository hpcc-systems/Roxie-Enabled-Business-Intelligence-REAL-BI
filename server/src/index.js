const path = require('path');

// Load .env file
require('dotenv').config({ path: path.join(process.cwd(), '.env') });

const express = require('express');
const { sequelize } = require('./models');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const chartRoutes = require('./routes/chart');
const clusterRoutes = require('./routes/cluster');
const dashboardRoutes = require('./routes/dashboard');
const queryRoutes = require('./routes/query');
const queryParamRoutes = require('./routes/queryParams');

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
app.use('/api/auth', authRoutes);
app.use('/api/chart', passport.authenticate(), chartRoutes);
app.use('/api/cluster', passport.authenticate(), clusterRoutes);
app.use('/api/dashboard', passport.authenticate(), dashboardRoutes);
app.use('/api/query', passport.authenticate(), queryRoutes);
app.use('/api/param', passport.authenticate(), queryParamRoutes);

sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(port, () => console.log(`Server listening on port ${port}.`));
  })
  .catch(err => console.error(err));
