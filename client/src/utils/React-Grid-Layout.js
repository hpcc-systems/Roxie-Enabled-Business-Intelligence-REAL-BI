// this function will return object for react-grid-layout library, it will look like {lg: Layout, md: Layout, ...} Layout[{x: 0, y: 0, w: 1...},{...}]
export const mapChartIdToLayout = chartIdArray => {
  return chartIdArray.reduce(
    (acc, id, index) => {
      const gridItem = {
        i: id.toString(),
        x: 0,
        y: index * 20,
        h: 20,
        minW: 2,
        maxW: 12,
        minH: 4,
      };
      for (const key in acc) {
        const cols = { lg: 6, md: 10, sm: 6, xs: 4, xxs: 2 };
        gridItem.w = cols[key];
        acc[key].push({ ...gridItem });
      }
      return acc;
    },
    { lg: [], md: [], sm: [], xs: [], xxs: [] },
  );
};
