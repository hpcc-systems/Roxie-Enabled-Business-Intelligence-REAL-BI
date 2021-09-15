const {
  DEFAULT_CLUSTER_NAME,
  DEFAULT_CLUSTER_HOST,
  DEFAULT_CLUSTER_INFOPORT,
  DEFAULT_CLUSTER_DATAPORT,
  DEFAULT_FILE_DEMO_TAXI,
  DEFAULT_FILE_DEMO_TRADES,
} = process.env;

const defaultCluster = {
  name: DEFAULT_CLUSTER_NAME,
  host: DEFAULT_CLUSTER_HOST,
  infoPort: DEFAULT_CLUSTER_INFOPORT,
  dataPort: DEFAULT_CLUSTER_DATAPORT,
};

const defaultWorkspaceName = 'Demo Workspace';
const defaultDashboardName = 'Charts Demo';

const defaultSourceFiles = {
  taxiData: DEFAULT_FILE_DEMO_TAXI,
  yearlyTrades: DEFAULT_FILE_DEMO_TRADES,
};

const textboxChart = {
  ecl: {},
  sort: 0,
  type: 'textBox',
  axis1: { showTickLabels: true },
  axis2: { showTickLabels: true },
  axis3: { showTickLabels: true },
  title: '',
  fields: [{ name: '', color: '#FFF', label: '', asLink: false, linkBase: '' }],
  sortBy: {},
  dataset: '',
  groupBy: {},
  stacked: false,
  isStatic: true,
  drillDown: { hasDrillDown: false, drilledByField: '', drilledOptions: [] },
  mapFields: [{ name: '', label: '' }],
  horizontal: false,
  mapMarkers: [
    {
      id: null,
      latitude: '',
      longitude: '',
      popUpInfo: [{ id: null, label: '', datafieldName: '' }],
      markerIcon: '',
      markerColor: '#C62136',
    },
  ],
  textBoxContent:
    '# Welcome to Real BI\n\n- To modify chart  click edit menu on top right corner\n- To see "User Guide" click "Help" icon.',
  textBoxAlignText: 'left',
};

const barDrilldownChart = {
  ecl: {},
  sort: 1,
  type: 'bar',
  axis1: { type: 'datetime', label: 'Pick up', value: 'tpep_pickup_datetime', showTickLabels: true },
  axis2: { type: 'number', label: 'Total amount', value: 'total_amount', showTickLabels: true },
  axis3: { showTickLabels: true },
  title: 'Pickup time to total amount analysis',
  fields: [
    { name: '', color: '#FFF', label: '', asLink: false, linkBase: '' },
    { name: '', color: '#FFF', label: '' },
    { name: '', color: '#FFF', label: '' },
  ],
  params: [
    { name: 'Start', type: 'number', value: '' },
    { name: 'Count', type: 'number', value: '200' },
    { name: 'vendorid', type: 'string', value: '' },
    { name: 'tpep_pickup_datetime', type: 'string', value: '' },
    { name: 'tpep_dropoff_datetime', type: 'string', value: '' },
    { name: 'passenger_count', type: 'string', value: '' },
    { name: 'trip_distance', type: 'string', value: '' },
    { name: 'pickup_longitude', type: 'string', value: '' },
    { name: 'pickup_latitude', type: 'string', value: '' },
    { name: 'rate_code_id', type: 'string', value: '' },
    { name: 'store_and_fwd_flag', type: 'string', value: '' },
    { name: 'dropoff_longitude', type: 'string', value: '' },
    { name: 'dropoff_latitude', type: 'string', value: '' },
    { name: 'payment_type', type: 'string', value: '' },
    { name: 'fare_amount', type: 'string', value: '' },
    { name: 'extra', type: 'string', value: '' },
    { name: 'mta_tax', type: 'string', value: '' },
    { name: 'tip_amount', type: 'string', value: '' },
    { name: 'tolls_amount', type: 'string', value: '' },
    { name: 'improvement_surcharge', type: 'string', value: '' },
    { name: 'total_amount', type: 'string', value: '' },
  ],
  sortBy: { type: 'number', order: 'desc', value: 'total_amount' },
  dataset: defaultSourceFiles.taxiData,
  groupBy: {},
  stacked: false,
  isStatic: false,
  drillDown: {
    hasDrillDown: true,
    drilledByField: 'tpep_pickup_datetime',
    drilledOptions: ['tolls_amount', 'improvement_surcharge', 'tip_amount', 'fare_amount', 'total_amount'],
  },
  mapFields: [
    { name: '', label: '' },
    { name: '', label: '' },
    { name: '', label: '' },
  ],
  horizontal: false,
  mapMarkers: [
    {
      id: null,
      latitude: '',
      longitude: '',
      popUpInfo: [{ id: null, label: '', datafieldName: '' }],
      markerIcon: '',
      markerColor: '#C62136',
    },
  ],
  conditionals: [{ field: '', rules: [{ color: '#FFF', value: '', operand: '>' }] }],
  chartDescription: 'Drill Down Chart Sorted By Total Amount',
  showLastExecuted: false,
  textBoxAlignText: 'left',
};

const mapChart = {
  ecl: {},
  sort: 2,
  type: 'map',
  axis1: { showTickLabels: true },
  axis2: { showTickLabels: true },
  axis3: { showTickLabels: true },
  title: 'Map chart',
  defaultMapSetting: {
    longitude: '-73.9866',
    latitude: '40.7360',
    zoom: '11.35',
    bearing: '0.00',
    pitch: '48.50',
  },
  fields: [
    { name: '', color: '#FFF', label: '', asLink: false, linkBase: '' },
    { name: '', color: '#FFF', label: '' },
    { name: '', color: '#FFF', label: '' },
  ],
  params: [
    { name: 'Start', type: 'number', value: '' },
    { name: 'Count', type: 'number', value: '200' },
    { name: 'vendorid', type: 'string', value: '' },
    { name: 'tpep_pickup_datetime', type: 'string', value: '' },
    { name: 'tpep_dropoff_datetime', type: 'string', value: '' },
    { name: 'passenger_count', type: 'string', value: '' },
    { name: 'trip_distance', type: 'string', value: '' },
    { name: 'pickup_longitude', type: 'string', value: '' },
    { name: 'pickup_latitude', type: 'string', value: '' },
    { name: 'rate_code_id', type: 'string', value: '' },
    { name: 'store_and_fwd_flag', type: 'string', value: '' },
    { name: 'dropoff_longitude', type: 'string', value: '' },
    { name: 'dropoff_latitude', type: 'string', value: '' },
    { name: 'payment_type', type: 'string', value: '' },
    { name: 'fare_amount', type: 'string', value: '' },
    { name: 'extra', type: 'string', value: '' },
    { name: 'mta_tax', type: 'string', value: '' },
    { name: 'tip_amount', type: 'string', value: '' },
    { name: 'tolls_amount', type: 'string', value: '' },
    { name: 'improvement_surcharge', type: 'string', value: '' },
    { name: 'total_amount', type: 'string', value: '' },
  ],
  sortBy: {},
  dataset: defaultSourceFiles.taxiData,
  groupBy: {},
  stacked: false,
  isStatic: false,
  drillDown: { hasDrillDown: false, drilledByField: '', drilledOptions: [] },
  mapFields: [],
  horizontal: false,
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
      id: 'f5a27317-826e-44cb-a197-823b773314fa',
      latitude: 'pickup_latitude',
      longitude: 'pickup_longitude',
      popUpInfo: [
        {
          id: '5ebd6684-f093-4349-aee4-83e7442e46bd',
          label: 'Trip Distance',
          datafieldName: 'trip_distance',
        },
        {
          id: 'a5dd2372-d135-4ac2-9a9e-6b779c3a9771',
          label: 'Total Passengers',
          datafieldName: 'passenger_count',
        },
        {
          id: 'b51890e6-f9bb-414d-bf38-9c54517391d1',
          label: 'Pickup Time',
          datafieldName: 'tpep_pickup_datetime',
        },
        { id: null, label: '', datafieldName: '' },
      ],
      markerIcon: 'EmojiPeopleIcon',
      markerColor: '#C62136',
    },
  ],
  conditionals: [{ field: '', rules: [{ color: '#FFF', value: '', operand: '>' }] }],
  textBoxAlignText: 'left',
};

const pieChart = {
  ecl: {},
  sort: 3,
  type: 'pie',
  axis1: { value: 'trade_year', showTickLabels: true },
  axis2: { type: 'number', value: 'yearcount', showTickLabels: true },
  axis3: { showTickLabels: true },
  title: 'Pie chart',
  fields: [
    { name: '', color: '#FFF', label: '', asLink: false, linkBase: '' },
    { name: '', color: '#FFF', label: '' },
  ],
  params: [
    { name: 'Start', type: 'number', value: '' },
    { name: 'Count', type: 'number', value: '200' },
    { name: 'trade_year', type: 'unsigned integer', value: '' },
    { name: 'yearcount', type: 'integer', value: '' },
  ],
  sortBy: {},
  dataset: defaultSourceFiles.yearlyTrades,
  groupBy: {},
  stacked: false,
  isStatic: false,
  drillDown: { hasDrillDown: false, drilledByField: '', drilledOptions: [] },
  mapFields: [
    { name: '', label: '' },
    { name: '', label: '' },
  ],
  horizontal: false,
  mapMarkers: [
    {
      id: null,
      latitude: '',
      longitude: '',
      popUpInfo: [{ id: null, label: '', datafieldName: '' }],
      markerIcon: '',
      markerColor: '#C62136',
    },
  ],
  conditionals: [{ field: '', rules: [{ color: '#FFF', value: '', operand: '>' }] }],
  showDataLabels: true,
  textBoxAlignText: 'left',
};

const donutChart = {
  ecl: {},
  sort: 4,
  type: 'donut',
  axis1: { value: 'trade_year', showTickLabels: true },
  axis2: { type: 'number', value: 'yearcount', showTickLabels: true },
  axis3: { showTickLabels: true },
  title: 'Donut chart',
  fields: [
    { name: '', color: '#FFF', label: '', asLink: false, linkBase: '' },
    { name: '', color: '#FFF', label: '' },
    { name: '', color: '#FFF', label: '' },
    { name: '', color: '#FFF', label: '' },
  ],
  params: [
    { name: 'Start', type: 'number', value: '' },
    { name: 'Count', type: 'number', value: '200' },
    { name: 'trade_year', type: 'unsigned integer', value: '' },
    { name: 'yearcount', type: 'integer', value: '' },
  ],
  sortBy: {},
  dataset: defaultSourceFiles.yearlyTrades,
  groupBy: {},
  stacked: false,
  isStatic: false,
  drillDown: { hasDrillDown: false, drilledByField: '', drilledOptions: [] },
  mapFields: [
    { name: '', label: '' },
    { name: '', label: '' },
    { name: '', label: '' },
    { name: '', label: '' },
  ],
  horizontal: false,
  mapMarkers: [
    {
      id: null,
      latitude: '',
      longitude: '',
      popUpInfo: [{ id: null, label: '', datafieldName: '' }],
      markerIcon: '',
      markerColor: '#C62136',
    },
  ],
  conditionals: [{ field: '', rules: [{ color: '#FFF', value: '', operand: '>' }] }],
  chartDescription: '',
  textBoxAlignText: 'left',
};

const tableChart = {
  ecl: {},
  sort: 5,
  type: 'table',
  axis1: { showTickLabels: true },
  axis2: { showTickLabels: true },
  axis3: { showTickLabels: true },
  title: 'Data overview',
  fields: [
    { name: 'tpep_pickup_datetime', color: '#FFF', label: 'Pickup time', asLink: false, linkBase: '' },
    { name: 'trip_distance', color: '#ffff', label: 'Distance', asLink: false, linkBase: '' },
    { name: 'passenger_count', color: '#ffff', label: 'Passengers', asLink: false, linkBase: '' },
    { name: 'fare_amount', color: '#ffff', label: 'Fare', asLink: false, linkBase: '' },
    {
      name: 'total_amount',
      text: '#FFFFFF',
      color: '#f46b6b',
      label: 'Total amount',
      asLink: false,
      linkBase: '',
    },
  ],
  params: [
    { name: 'Start', type: 'number', value: '' },
    { name: 'Count', type: 'number', value: '200' },
    { name: 'vendorid', type: 'string', value: '' },
    { name: 'tpep_pickup_datetime', type: 'string', value: '' },
    { name: 'tpep_dropoff_datetime', type: 'string', value: '' },
    { name: 'passenger_count', type: 'string', value: '' },
    { name: 'trip_distance', type: 'string', value: '' },
    { name: 'pickup_longitude', type: 'string', value: '' },
    { name: 'pickup_latitude', type: 'string', value: '' },
    { name: 'rate_code_id', type: 'string', value: '' },
    { name: 'store_and_fwd_flag', type: 'string', value: '' },
    { name: 'dropoff_longitude', type: 'string', value: '' },
    { name: 'dropoff_latitude', type: 'string', value: '' },
    { name: 'payment_type', type: 'string', value: '' },
    { name: 'fare_amount', type: 'string', value: '' },
    { name: 'extra', type: 'string', value: '' },
    { name: 'mta_tax', type: 'string', value: '' },
    { name: 'tip_amount', type: 'string', value: '' },
    { name: 'tolls_amount', type: 'string', value: '' },
    { name: 'improvement_surcharge', type: 'string', value: '' },
    { name: 'total_amount', type: 'string', value: '' },
  ],
  sortBy: {},
  dataset: defaultSourceFiles.taxiData,
  groupBy: {},
  stacked: false,
  isStatic: false,
  drillDown: { hasDrillDown: false, drilledByField: '', drilledOptions: [] },
  mapFields: [
    { name: '', label: '' },
    { name: '', label: '' },
  ],
  horizontal: false,
  mapMarkers: [
    {
      id: null,
      latitude: '',
      longitude: '',
      popUpInfo: [{ id: null, label: '', datafieldName: '' }],
      markerIcon: '',
      markerColor: '#C62136',
    },
  ],
  conditionals: [
    { field: 'tpep_pickup_datetime', rules: [{ color: '#FFF', value: '', operand: '>' }] },
    { field: 'trip_distance', rules: [{ color: '#FFF', value: '', operand: '>' }] },
    { field: 'passenger_count', rules: [{ color: '#FFF', value: '', operand: '>' }] },
    { field: 'fare_amount', rules: [{ color: '#FFF', value: '', operand: '>' }] },
    { field: 'total_amount', rules: [{ color: '#FFF', value: '', operand: '>' }] },
  ],
  textBoxAlignText: 'left',
};

const lineChart = {
  ecl: {},
  sort: 6,
  type: 'line',
  axis1: { type: 'number', label: 'Year', value: 'trade_year', showTickLabels: true },
  axis2: { type: 'number', label: 'Total', value: 'yearcount', showTickLabels: true },
  axis3: { showTickLabels: true },
  title: 'Line Chart',
  fields: [
    { name: '', color: '#FFF', label: '', asLink: false, linkBase: '' },
    { name: '', color: '#FFF', label: '' },
  ],
  params: [
    { name: 'Start', type: 'number', value: '' },
    { name: 'Count', type: 'number', value: '' },
    { name: 'trade_year', type: 'unsigned integer', value: '' },
    { name: 'yearcount', type: 'integer', value: '' },
  ],
  sortBy: {},
  dataset: defaultSourceFiles.yearlyTrades,
  groupBy: {},
  stacked: false,
  isStatic: false,
  drillDown: { hasDrillDown: false, drilledByField: '', drilledOptions: [] },
  mapFields: [
    { name: '', label: '' },
    { name: '', label: '' },
  ],
  horizontal: false,
  mapMarkers: [
    {
      id: null,
      latitude: '',
      longitude: '',
      popUpInfo: [{ id: null, label: '', datafieldName: '' }],
      markerIcon: '',
      markerColor: '#C62136',
    },
  ],
  conditionals: [{ field: '', rules: [{ color: '#FFF', value: '', operand: '>' }] }],
  textBoxAlignText: 'left',
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

const commonFields = { i: '', minW: 2, maxW: 12, minH: 4, moved: false, static: false };

const defaultChartslayout = {
  lg: [
    { w: 4, h: 17, x: 0, y: 0, ...commonFields },
    { w: 8, h: 35, x: 4, y: 0, ...commonFields },
    { w: 4, h: 55, x: 0, y: 17, ...commonFields },
    { w: 4, h: 37, x: 4, y: 35, ...commonFields },
    { w: 4, h: 37, x: 8, y: 35, ...commonFields },
    { w: 7, h: 37, x: 0, y: 72, ...commonFields },
    { w: 5, h: 37, x: 7, y: 72, ...commonFields },
  ],
};

module.exports = {
  defaultChartsConfigs,
  defaultChartslayout,
  defaultWorkspaceName,
  defaultDashboardName,
  defaultSourceFiles,
  defaultCluster,
};
