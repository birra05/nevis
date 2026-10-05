import { describe, expect, it } from 'vitest';
import type { AnalyticsPayload } from '../../types.ts';
import { toAnalyticsView } from './analytics.ts';

const payload: AnalyticsPayload = {
  tree: {
    id: 'company',
    name: 'Company',
    nodeType: 'company',
    children: [
      {
        id: 'branch',
        name: 'Branch 1',
        nodeType: 'branch',
        children: [],
      },
    ],
  },
  matrix: [
    { date: '2024-02-01', values: { company: 100, branch: 60 } },
    { date: '2024-03-01', values: { company: 110, branch: 65 } },
  ],
};

describe('toAnalyticsView', () => {
  it('preserves API matrix order and supplied values', () => {
    const analytics = toAnalyticsView(payload);

    expect(analytics.periods).toEqual([
      { date: '2024-02-01', label: 'Feb 2024' },
      { date: '2024-03-01', label: 'Mar 2024' },
    ]);
    expect(analytics.valuesByNodeId.get('company')).toEqual([100, 110]);
    expect(analytics.valuesByNodeId.get('branch')).toEqual([60, 65]);
  });
});
