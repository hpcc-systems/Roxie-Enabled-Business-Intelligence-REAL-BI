import {
  CREATE_CHART,
  CREATE_FILTER,
  DELETE_CHART,
  DELETE_FILTER,
  GET_DASHBOARD,
  SET_DASHBOARD_ERRORS,
  CLEAR_DASHBOARD,
  UPDATE_CHART,
  UPDATE_FILTER,
  UPDATE_RELATIONS,
  FETCH_CHART_DATA_REQUEST,
  FETCH_CHART_DATA_SUCCESS,
  FETCH_CHART_DATA_FAILURE,
  REFRESH_ALL_CHARTS_DATA,
  REFRESH_DATA_BY_CHART_IDS,
  UPDATE_DASHBOARD_LAYOUT,
  SET_ACTIVE_CHART,
  SET_INTERACTIVE_OBJECT,
} from './actions';

import { mapChartIdToLayout } from '../../utils/React-Grid-Layout';

const initState = { dashboard: {}, errorObj: {} };

export default (state = initState, { type, payload }) => {
  switch (type) {
    /* -------------------------- */
    case GET_DASHBOARD: {
      // parsing layout from text to object
      if (payload.layout) {
        payload.layout = JSON.parse(payload.layout);
      } else {
        payload.layout = mapChartIdToLayout(payload.charts.map(el => el.id));
      }
      return { ...state, errorObj: {}, dashboard: { ...state.dashboard, ...payload } };
    }
    /* -------------------------- */
    case CLEAR_DASHBOARD: {
      return { ...initState };
    }
    /* -------------------------- */
    case UPDATE_DASHBOARD_LAYOUT: {
      const newState = { ...state, dashboard: { ...state.dashboard, layout: payload } };
      return newState;
    }
    /* -------------------------- */
    case UPDATE_CHART: {
      const newChartsArr = state.dashboard.charts.map(el => {
        if (payload.id === el.id) {
          return { ...el, ...payload };
        }
        return el;
      });
      const newState = {
        ...state,
        dashboard: { ...state.dashboard, charts: newChartsArr },
      };
      return newState;
    }
    /* -------------------------- */
    case DELETE_CHART: {
      const dashboardLayout = state.dashboard?.layout;
      const newLayouts = {};
      for (const key in dashboardLayout) {
        newLayouts[key] = dashboardLayout[key].filter(el => el.i !== payload);
      }
      const newChartsArr = state.dashboard.charts.filter(el => payload !== el.id);
      const newState = {
        ...state,
        dashboard: { ...state.dashboard, layout: newLayouts, charts: newChartsArr },
      };
      return newState;
    }
    /* -------------------------- */
    case SET_ACTIVE_CHART: {
      let activeChart = null;
      if (payload) {
        const activeChartIndex = state.dashboard.charts.findIndex(el => payload === el.id);
        if (activeChartIndex !== -1) activeChart = state.dashboard.charts[activeChartIndex];
      }
      const newState = {
        ...state,
        dashboard: { ...state.dashboard, activeChart },
      };
      return newState;
    }
    /* -------------------------- */
    case SET_INTERACTIVE_OBJECT: {
      const relations = state.dashboard.relations;
      const interactiveObj = state.dashboard?.interactiveObj;
      const { chartID, field, value } = payload;
      let newInteractiveObj = {};
      if (chartID) {
        const effectedCharts = relations.map(el => {
          if (el.sourceID === payload.chartID) return el.targetID;
        });
        const effectedChartIds = [...new Set(effectedCharts)];

        newInteractiveObj = { ...interactiveObj, chartID, field, value, effectedChartIds };
      }

      const newState = {
        ...state,
        dashboard: { ...state.dashboard, interactiveObj: newInteractiveObj },
      };
      return newState;
    }
    /* -------------------------- */

    case FETCH_CHART_DATA_REQUEST:
    case FETCH_CHART_DATA_FAILURE:
    case FETCH_CHART_DATA_SUCCESS: {
      const newChartsArr = state.dashboard.charts.map(el => {
        if (el.id === payload.id) return { ...el, ...payload };
        return el;
      });
      const newState = { ...state, dashboard: { ...state.dashboard, charts: newChartsArr } };
      // console.log(`------------------ ${type} for ${payload.id}`);
      return newState;
    }
    /* -------------------------- */
    case REFRESH_ALL_CHARTS_DATA: {
      const newChartsArr = state.dashboard.charts.map(el => {
        return { ...el, toggleRefresh: !el.toggleRefresh };
      });
      const newState = { ...state, dashboard: { ...state.dashboard, charts: newChartsArr } };
      return newState;
    }
    /* -------------------------- */
    case REFRESH_DATA_BY_CHART_IDS: {
      const chartIds = payload;
      const newChartsArr = state.dashboard.charts.map(el => {
        if (chartIds.includes(el.id)) {
          el.toggleRefresh = !el.toggleRefresh;
        }
        return el;
      });
      const newState = { ...state, dashboard: { ...state.dashboard, charts: newChartsArr } };
      return newState;
    }
    /* -------------------------- */
    case SET_DASHBOARD_ERRORS:
      return { ...state, errorObj: payload };
    /* -------------------------- */
    case CREATE_CHART: {
      const newLayoutItem = mapChartIdToLayout([payload.id]);
      let newLayouts = {};
      const dashboardLayout = state.dashboard?.layout;
      if (dashboardLayout) {
        for (const key in dashboardLayout) {
          const gridItem = { ...newLayoutItem[key][0] };
          gridItem.y = Infinity; // puts grid item in last row
          newLayouts[key] = [...dashboardLayout[key], gridItem];
        }
      } else {
        newLayouts = newLayoutItem;
      }
      return {
        ...state,
        errorObj: {},
        dashboard: {
          ...state.dashboard,
          layout: newLayouts,
          charts: [...state.dashboard.charts, payload],
        },
      };
    }
    /* -------------------------- */
    case CREATE_FILTER:
      return {
        ...state,
        errorObj: {},
        dashboard: { ...state.dashboard, filters: [...state.dashboard.filters, payload] },
      };
    /* -------------------------- */
    case UPDATE_FILTER:
    case DELETE_FILTER:
      return {
        ...state,
        errorObj: {},
        dashboard: { ...state.dashboard, filters: payload },
      };
    /* -------------------------- */
    case UPDATE_RELATIONS:
      return {
        ...state,
        errorObj: {},
        dashboard: { ...state.dashboard, relations: payload },
      };
    /* -------------------------- */
    default:
      return state;
  }
};
