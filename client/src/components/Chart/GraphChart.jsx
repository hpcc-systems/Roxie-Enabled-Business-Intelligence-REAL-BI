/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Alert } from '@material-ui/lab';
import { FlowAnalysisGraph } from '@ant-design/charts';
import { getAnchorPoints, getMarkerPosition, mapDataToGraphChartData } from '../../utils/graphUtils';

const GraphChart = props => {
  const isStatic = props.configuration.isStatic;
  const chart = props.configuration.graphChart;
  const userConfig = chart.config;
  const nodes = chart.nodes;
  const edges = chart.edges;
  const data = props.data?.[0];

  const chartData = isStatic ? { nodes, edges } : mapDataToGraphChartData(data, userConfig);

  if (chartData.error) {
    return <Alert severity='error'>{chartData.error}</Alert>; // return Error if data is not suitable for there chart
  }

  const isHorizontalGraph = userConfig.rankdir === 'LR' || userConfig.rankdir === 'RL' || !userConfig.rankdir;

  const config = {
    data: chartData,
    nodeCfg: {
      size: [140, 25],
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
    // TODO FIGURE OUT HOW TO UPDATE LAYOUT DYNAMICALLY SO APP WILL NOT CRUSH
    // layout: {
    //   center: [0, 0], // Layout center.
    //   rankdir: 'LR', // Direction for rank nodes. Can be TB, BT, LR, or RL, where T = top, B = bottom, L = left, and R = right.
    //   nodesepFunc: () => 20, //Number of pixels that separate nodes vertically in the layout.
    //   ranksepFunc: () => 20, // Number of pixels that separate nodes horizontally in the layout.
    // },
    // nodeAnchorPoints: [
    //   [1, 0.5],
    //   [0, 0.5],
    // ],
  };

  const graphRef = useRef();

  // console.log('userConfig.rankdir :>> ', userConfig.rankdir);

  // const [layout, setLayout] = useState();
  // const [anchorPoints, setAnchorPoints] = useState();

  // useEffect(() => {
  //   setLayout(() => ({
  // rankdir: userConfig.rankdir, // Direction for rank nodes. Can be TB, BT, LR, or RL, where T = top, B = bottom, L = left, and R = right.
  // center: [0, 0], // Layout center.
  // nodesepFunc: () => 20, //Number of pixels that separate nodes vertically in the layout.
  // ranksepFunc: () => 20, // Number of pixels that separate nodes horizontally in the layout.
  //   }));
  //   setAnchorPoints(getAnchorPoints(userConfig.rankdir));
  // }, [userConfig.rankdir]);

  return (
    <FlowAnalysisGraph
      {...config}
      // layout={layout}
      // nodeAnchorPoints={anchorPoints}
      onReady={graph => (graphRef.current = graph)}
    />
  );
};

export default GraphChart;
