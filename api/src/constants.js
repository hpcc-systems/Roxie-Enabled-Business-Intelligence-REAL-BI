const tableNames = {
  user: 'user',
  chart: 'chart',
  cluster: 'cluster',
  clusterCredentials: 'cluster_credentials',
  dashboard: 'dashboard',
  dashboardFilter: 'dashboard_filter',
  dashboardFilterValue: 'dashboard_filter_value',
  dashboardPermission: 'dashboard_permission',
  dashboardRelation: 'dashboard_relation',
  openDashboard: 'open_dashboard',
  role: 'role',
  share: 'share',
  source: 'source',
  sourceType: 'source_type',
  workspace: 'workspace',
  workspaceDirectory: 'workspace_directory',
  workspacePermission: 'workspace_permission',
};

const defaultWorkspaceName = 'Demo Workspace';
const defaultDashboardName = 'Charts Demo';

const defaultSourceFiles = {
  taxiData: 'temp::hfs::taxidata_small',
  yearlyTrades: 'thor::demo::total::yearly::trades',
};

const defaultCluster = {
  name: 'testCluster',
  host: 'http://10.173.147.1',
  infoPort: '8010',
  dataPort: '8002',
};

const commonChartConfig = {
  ecl: {},
  groupBy: {},
  axis1: { showTickLabels: true },
  axis2: { showTickLabels: true },
  axis3: { showTickLabels: true },
  fields: [{ color: '#FFF', label: '', name: '', asLink: false, linkBase: '' }],
  textBoxAlignText: 'left',
  horizontal: false,
  isStatic: false,
  showDataLabels: false,
  showLastExecuted: false,
  conditionals: [],
  params: [
    { name: 'Start', type: 'number', value: '' },
    { name: 'Count', type: 'number', value: '200' },
  ],
  mapMarkers: [
    {
      id: null,
      longitude: '',
      latitude: '',
      markerIcon: '',
      markerColor: '#C62136',
      popUpInfo: [{ id: null, datafieldName: '', label: '' }],
    },
  ],
};

const textboxChart = {
  ...commonChartConfig,
  sort: 0,
  type: 'textBox',
  title: '',
  params: [],
  dataset: '',
  isStatic: true,
  textBoxContent:
    '# Welcome to Real BI\n\n- To modify chart  click edit menu on top right corner\n- To see "User Guide" click "Help" icon.',
};

const barDrilldownChart = {
  ...commonChartConfig,
  sort: 1,
  type: 'bar',
  axis1: { type: 'datetime', label: 'Pick up', value: 'tpep_pickup_datetime', showTickLabels: true },
  axis2: { type: 'number', label: 'Total amount', value: 'total_amount', showTickLabels: true },
  title: 'Pick Up time to Total Amount analysis',
  chartDescription: 'Drill Down Chart Sorted By Total Amount',
  sortBy: { type: 'number', order: 'desc', value: 'total_amount' },
  dataset: defaultSourceFiles.taxiData,
  drillDown: {
    hasDrillDown: true,
    drilledByField: 'tpep_pickup_datetime',
    drilledOptions: ['tolls_amount', 'improvement_surcharge', 'tip_amount', 'fare_amount', 'total_amount'],
  },
};

const mapChart = {
  ...commonChartConfig,
  sort: 2,
  type: 'map',
  title: 'Pick-up Location',
  defaultChart: {
    longitude: '-73.976',
    latitude: '40.7399',
    zoom: '11.43',
    bearing: '10.4',
    pitch: '65.5',
  },
  dataset: defaultSourceFiles.taxiData,
  mapMarkers: [
    {
      id: null,
      latitude: '',
      longitude: '',
      popUpInfo: [{ id: null, label: '', datafieldName: '' }],
      markerIcon: '',
      markerColor: '#C62136',
    },
    {
      id: 'c2133fa8-e8e0-406f-821e-e4b143cf1a5e',
      latitude: 'pickup_latitude',
      longitude: 'pickup_longitude',
      popUpInfo: [
        {
          id: '508fa661-db18-4f71-806b-5b5422772c81',
          label: 'Trip Distance',
          datafieldName: 'trip_distance',
        },
        {
          id: 'd8b8c3d7-fa0b-4935-b461-e9166e097c9a',
          label: 'Total Passengers',
          datafieldName: 'passenger_count',
        },
        {
          id: '41721aae-7aab-4bc9-a5f7-c50876c9b4f0',
          label: 'Pickup Time',
          datafieldName: 'tpep_pickup_datetime',
        },
        { id: null, label: '', datafieldName: '' },
      ],
      markerIcon: 'EmojiPeopleIcon',
      markerColor: '#C62136',
    },
  ],
};

const tableChart = {
  ...commonChartConfig,
  sort: 3,
  type: 'table',
  order: 'desc',
  title: 'Data overview',
  dataset: defaultSourceFiles.taxiData,
  fields: [
    { name: 'tpep_pickup_datetime', color: '#FFF', label: 'Pickup time', asLink: false, linkBase: '' },
    { name: 'trip_distance', color: '#ffff', label: 'Distance', asLink: false, linkBase: '' },
    { name: 'passenger_count', color: '#ffff', label: 'Passengers', asLink: false, linkBase: '' },
    { name: 'fare_amount', color: '#FFF', label: 'Fare' },
    { name: 'total_amount', color: '#ffff', label: 'Total amout', asLink: false, linkBase: '' },
  ],
};

const pieChart = {
  ...commonChartConfig,
  sort: 4,
  type: 'pie',
  axis1: { value: 'trade_year', showTickLabels: true },
  axis2: { type: 'number', value: 'yearcount', showTickLabels: true },
  title: 'Sales Data',
  showDataLabels: true,
  dataset: defaultSourceFiles.yearlyTrades,
};

const donutChart = {
  ...commonChartConfig,
  sort: 5,
  type: 'donut',
  axis1: { value: 'trade_year', showTickLabels: true },
  axis2: { type: 'number', value: 'yearcount', showTickLabels: true },
  title: 'Donut Chart',
  dataset: defaultSourceFiles.yearlyTrades,
};

const lineChart = {
  ...commonChartConfig,
  sort: 6,
  type: 'line',
  dataset: defaultSourceFiles.yearlyTrades,
  axis1: { type: 'number', label: 'Year', value: 'trade_year', showTickLabels: true },
  axis2: { type: 'number', label: 'Total', value: 'yearcount', showTickLabels: true },
  title: 'Line Chart',
};

const commonFields = { i: '', minW: 2, maxW: 12, minH: 4, moved: false, static: false };

const defaultChartslayout = {
  lg: [
    { w: 4, h: 17, x: 0, y: 0, ...commonFields },
    { w: 8, h: 35, x: 4, y: 0, ...commonFields },
    { w: 4, h: 55, x: 0, y: 17, ...commonFields },
    { w: 4, h: 37, x: 4, y: 35, ...commonFields },
    { w: 4, h: 37, x: 8, y: 35, ...commonFields },
    { w: 6, h: 37, x: 0, y: 72, ...commonFields },
    { w: 6, h: 37, x: 6, y: 72, ...commonFields },
  ],
};

const defaultChartsConfigs = [
  textboxChart,
  barDrilldownChart,
  mapChart,
  pieChart,
  donutChart,
  tableChart,
  lineChart,
];

module.exports = {
  tableNames,
  defaultChartsConfigs,
  defaultChartslayout,
  defaultWorkspaceName,
  defaultDashboardName,
  defaultSourceFiles,
  defaultCluster,
};
