import { combineReducers } from 'redux';

import auth from './auth/reducers';
import cluster from './cluster/reducers';
import dashboard from './dashboard/reducers';
import query from './query/reducers';

export default combineReducers({ auth, cluster, dashboard, query });
