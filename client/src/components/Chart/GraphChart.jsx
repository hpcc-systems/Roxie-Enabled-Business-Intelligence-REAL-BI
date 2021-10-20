/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { FlowAnalysisGraph } from '@ant-design/charts';
import { Alert } from '@material-ui/lab';
import defaultChart from '../ChartEditor/Tabs/Graph/graphdata.json';
import { getAnchorPoints, getMarkerPosition, mapDataToGraphChartData } from '../../utils/graphUtils';

const GraphChart = props => {
  const isStatic = props.configuration.isStatic;
  const chart = props.configuration.graphChart;
  const userConfig = chart.config;
  const nodes = chart.nodes;
  const edges = chart.edges;
  const data = props.data?.[0];

  const chartData = isStatic ? { nodes, edges } : mapDataToGraphChartData(data, userConfig);

  console.log(`chartData`, chartData);

  if (chartData.error) {
    return <Alert severity='error'>{chartData.error}</Alert>; // return Error if data is not suitable for there chart
  }

  const isHorizontalGraph = userConfig.rankdir === 'LR' || userConfig.rankdir === 'RL' || !userConfig.rankdir;

  const graphRef = useRef();

  const config = {
    data: chartData,
    nodeCfg: {
      size: [140, 25],
      anchorPoints: getAnchorPoints(userConfig.rankdir),
      items: {
        padding: 6,
        containerStyle: {
          fill: '#fff',
        },
        style: (cfg, group, type) => {
          const styles = {
            icon: {
              width: 12,
              height: 12,
            },
            value: {
              fill: '#f00',
            },
            text: {
              fill: '#aaa',
            },
          };
          return styles[type];
        },
      },
      nodeStateStyles: {
        hover: {
          stroke: '#1890ff',
          lineWidth: 2,
        },
      },
      title: {
        containerStyle: {
          fill: 'transparent',
        },
        style: {
          fill: '#000',
          fontSize: 12,
        },
      },
      style: {
        fill: '#E6EAF1',
        stroke: '#B2BED5',
        radius: [2, 2, 2, 2],
      },
    },
    edgeCfg: {
      type: isHorizontalGraph ? 'cubic-horizontal' : 'polyline',
      label: {
        style: {
          fill: '#aaa',
          fontSize: 12,
          fillOpacity: 1,
        },
      },
      endArrow: {
        fill: userConfig.strokeColor,
        type: 'triangle',
      },
      style: edge => {
        const stroke = edge.target === '0' ? '#c86bdd' : '#8d323c ';
        return {
          stroke: userConfig.strokeColor || stroke,
          lineWidth: 1,
          strokeOpacity: 0.5,
        };
      },
      edgeStateStyles: {
        hover: {
          lineWidth: 2,
          strokeOpacity: 1,
        },
      },
    },
    markerCfg: cfg => {
      const { edges } = chartData;
      return {
        position: getMarkerPosition(userConfig.rankdir),
        show: edges.find(item => item.source === cfg.id),
        collapsed: !edges.find(item => item.source === cfg.id),
      };
    },
    behaviors: ['drag-canvas', 'zoom-canvas', 'drag-node'],
    layout: {
      /** Direction for rank nodes. Can be TB, BT, LR, or RL, where T = top, B = bottom, L = left, and R = right. */
      rankdir: 'LR',
      /** Layout center. */
      center: [0, 0],
      /** Number of pixels that separate nodes vertically in the layout. */
      nodesepFunc: () => 20,
      /** Number of pixels that separate nodes horizontally in the layout. */
      ranksepFunc: () => 20,
    },
    onReady: graph => {
      graphRef.current = graph;
    },
  };

  // useEffect(() => {
  //   graphRef.current.updateLayout({
  //     rankdir: userConfig.rankdir,
  //   });
  // });

  return <FlowAnalysisGraph {...config} />;
};

export default GraphChart;
