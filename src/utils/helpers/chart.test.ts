import { describe, expect, it } from 'vitest';
import type { BranchNode, ChannelNode, CompanyNode } from '../../types.ts';
import { toChartModel } from './chart.ts';

const periods = [
  { date: '2024-02-01', label: 'Feb 2024' },
  { date: '2024-03-01', label: 'Mar 2024' },
] as const;

describe('toChartModel', () => {
  it('uses direct children only and preserves supplied values as-is', () => {
    const branch: BranchNode = {
      id: 'branch',
      name: 'Branch',
      nodeType: 'branch',
      children: [],
    };
    const company: CompanyNode = {
      id: 'company',
      name: 'Company',
      nodeType: 'company',
      children: [branch],
    };
    const values = new Map<string, readonly number[]>([
      ['company', [999, 999]],
      ['branch', [10, 12]],
    ]);

    expect(toChartModel(company, periods, values)).toEqual({
      series: [{ id: 'branch', name: 'Branch' }],
      data: [
        { period: 'Feb 2024', values: { branch: 10 } },
        { period: 'Mar 2024', values: { branch: 12 } },
      ],
    });
  });

  it('maps a leaf to its own series', () => {
    const leaf: ChannelNode = { id: 'paid', name: 'New paid', nodeType: 'channel' };
    const values = new Map<string, readonly number[]>([['paid', [2, 4]]]);

    expect(toChartModel(leaf, periods, values).data).toEqual([
      { period: 'Feb 2024', values: { paid: 2 } },
      { period: 'Mar 2024', values: { paid: 4 } },
    ]);
  });
});
