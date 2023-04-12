/* eslint-disable no-unused-vars */
export const mapDataToGraphChartData = (data, config) => {
  const nodesField = config.nodesField;
  const edgesField = config.edgesField;

  try {
    const newNodes = data[nodesField]?.map(node => {
      if (node.id === undefined || node.value.title === undefined || node.value.items === undefined) {
        throw new Error('Wrong data passed to nodes');
      }
      node.value.items.forEach(element => {
        if (!element.value) element.value = '';
      });
      return node;
    });

    const newEdges = data[edgesField]?.map(edge => {
      if (edge.source === undefined || edge.target === undefined) {
        throw new Error('Wrong data passed to edges');
      }
      return edge;
    });

    if (!newNodes) throw new Error('Can not find Nodes list');
    if (!newEdges) throw new Error('Can not find Edges list');

    return { nodes: newNodes, edges: newEdges };
  } catch (error) {
    return { error: error.message };
  }
};

export const getMarkerPosition = layout => {
  if (layout == 'LR') return 'right';
  if (layout == 'RL') return 'left';
  if (layout == 'TB') return 'bottom';
  if (layout == 'BT') return 'top';
  return 'left';
};

export const getAnchorPoints = layout => {
  if (layout === 'RL')
    return [
      [0, 0.5],
      [1, 0.5],
    ];
  if (layout === 'TB')
    return [
      [0.5, 1],
      [0.5, 0],
    ];
  if (layout === 'BT')
    return [
      [0.5, 0],
      [0.5, 1],
    ];
  if (layout === 'LR' || !layout)
    return [
      [1, 0.5],
      [0, 0.5],
    ];
};
