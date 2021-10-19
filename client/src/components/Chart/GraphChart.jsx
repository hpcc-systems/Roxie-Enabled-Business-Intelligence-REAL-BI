import React, { useRef } from 'react';
import { FlowAnalysisGraph } from '@ant-design/charts';

const GraphChart = props => {
  const staticConfig = props.configuration.graphNodes;

  const config = {
    data: staticConfig,
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
      label: {
        style: {
          fill: '#aaa',
          fontSize: 12,
          fillOpacity: 1,
        },
      },
      style: edge => {
        const stroke = edge.target === '0' ? '#c86bdd' : '#5ae859';
        return {
          stroke,
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
      const { edges } = staticConfig;
      return {
        position: 'right',
        show: edges.find(item => item.source === cfg.id),
        collapsed: !edges.find(item => item.source === cfg.id),
      };
    },
    behaviors: ['drag-canvas', 'zoom-canvas', 'drag-node'],
    layout: {
      /** Direction for rank nodes. Can be TB, BT, LR, or RL, where T = top, B = bottom, L = left, and R = right. */
      rankdir: 'TB',
      // ranksepFunc: () => 20,
    },
  };

  const ref = useRef();

  React.useEffect(() => {
    console.log(ref.current);
  }, []);

  return <FlowAnalysisGraph {...config} onReady={chart => (ref.current = chart)} />;
};

export default GraphChart;
