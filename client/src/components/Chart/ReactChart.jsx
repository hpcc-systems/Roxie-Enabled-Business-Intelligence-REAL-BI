import React from 'react';
import { useRef, useEffect } from 'react';
import { Heatmap } from '@antv/g2plot';

const ReactChart = ({ config }) => {
  const ref = useRef(null);
  const chart = useRef(undefined);

  function newPlot() {
    console.log('New Plot');
    if (chart.current) {
      console.log('config =', config);
      console.log('ref.current =', ref.current);
      console.log('Chart ref =', chart, ' ', ref);
      // chart.current.render();
      // const conf = { xField: config.xField };
      // chart.current.updateConfig(conf);
      // chart.current.changeData(config);
      // chart.current.repaint();
      // chart.current.render();
      chart.destroy();
    } else {
      chart.current = new Heatmap(ref.current, config);
      syncRef(chart, ref);
      chart.current.render();
    }
  }

  useEffect(() => {
    newPlot();
  });

  function syncRef(source, target) {
    if (typeof target === 'function') {
      target(source.current);
    } else if (target) {
      target.current = source.current;
    }
  }

  return <div className={Heatmap} ref={ref} />;
};

export default ReactChart;
