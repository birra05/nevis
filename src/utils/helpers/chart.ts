import { isParentNode, type ChartModel, type Period, type TreeNode } from '../../types.ts';

const getValue = (
  valuesByNodeId: ReadonlyMap<string, readonly number[]>,
  id: string,
  index: number,
) => {
  const value = valuesByNodeId.get(id)?.[index];

  if (value === undefined) {
    throw new Error(`Missing derived value for node "${id}".`);
  }

  return value;
};

/**
 * Produces chart data without recalculating totals. Non-leaves show their
 * direct children; leaves show their own trend as a single series.
 */
export const toChartModel = (
  node: TreeNode,
  periods: readonly Period[],
  valuesByNodeId: ReadonlyMap<string, readonly number[]>,
): ChartModel => {
  const seriesNodes = isParentNode(node) && node.children.length ? node.children : [node];

  return {
    series: seriesNodes.map(({ id, name }) => ({ id, name })),
    data: periods.map(({ label }, index) => ({
      period: label,
      values: Object.fromEntries(
        seriesNodes.map((seriesNode) => [
          seriesNode.id,
          getValue(valuesByNodeId, seriesNode.id, index),
        ]),
      ),
    })),
  };
};
