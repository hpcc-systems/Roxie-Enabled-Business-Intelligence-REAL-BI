export const mapDataToGraphChartData = (data, config) => {
  const nodesField = config.nodesField;
  const edgesField = config.edgesField;
  try {
    const newNodes = data[nodesField]?.Row?.map(node => {
      const newNode = {
        id: node.id,
        value: { title: node.value?.title, items: node.value?.items?.Row },
      };
      if (
        newNode.id === undefined ||
        newNode.value.title === undefined ||
        newNode.value.items === undefined
      ) {
        throw new Error('Wrong data passed to nodes');
      }
      return newNode;
    });

    const newEdges = data[edgesField].Row.map(edge => {
      if (edge.source === undefined || edge.target === undefined) {
        throw new Error('Wrong data passed to edges');
      }
      return edge;
    });

    if (!newNodes) throw new Error('Can not find Nodes list');
    if (!newNodes) throw new Error('Can not find Edges list');

    console.log('newNodes :>> ', newNodes);
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
