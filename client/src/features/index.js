import { combineReducers } from 'redux';

import auth from './auth/reducers';
import chart from './chart/reducers';
import cluster from './cluster/reducers';
import dashboard from './dashboard/reducers';

export default combineReducers({ auth, chart, cluster, dashboard });
