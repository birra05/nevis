import type { ChartModel, TreeNode } from '../../types.js';

/**
 * Produces chart data without recalculating totals. Non-leaves show their
 * direct children; leaves show their own trend as a single series.
 */
export const toChartModel = (node: TreeNode, timeSlots: readonly string[]): ChartModel => {
  const seriesNodes = node.children?.length ? node.children : [node];

  return {
    series: seriesNodes.map(({ id, name }) => ({ id, name })),
    data: timeSlots.map((timeSlot, index) => ({
      timeSlot,
      values: Object.fromEntries(
        seriesNodes.map((seriesNode) => [seriesNode.id, seriesNode.values[index]]),
      ),
    })),
  };
};
