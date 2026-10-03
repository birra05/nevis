import { describe, expect, it } from 'vitest';
import type { TreeNode } from '../../types.js';
import { toChartModel } from './chart.js';

describe('toChartModel', () => {
  it('uses direct children only and preserves supplied values as-is', () => {
    const node: TreeNode = {
      id: 'company',
      name: 'Company',
      values: [999, 999],
      children: [
        { id: 'existing', name: 'Existing clients', values: [10, 12] },
        { id: 'organic', name: 'New organic', values: [1, 3] },
      ],
    };

    expect(toChartModel(node, ['Feb', 'Mar'])).toEqual({
      series: [
        { id: 'existing', name: 'Existing clients' },
        { id: 'organic', name: 'New organic' },
      ],
      data: [
        { timeSlot: 'Feb', values: { existing: 10, organic: 1 } },
        { timeSlot: 'Mar', values: { existing: 12, organic: 3 } },
      ],
    });
  });

  it('maps a leaf to its own series', () => {
    const leaf: TreeNode = { id: 'paid', name: 'New paid', values: [2, 4] };

    expect(toChartModel(leaf, ['Feb', 'Mar']).data).toEqual([
      { timeSlot: 'Feb', values: { paid: 2 } },
      { timeSlot: 'Mar', values: { paid: 4 } },
    ]);
  });
});
