import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import type { ChartModel } from '../../types';
import { Chart } from './index';

vi.mock('recharts', async (importOriginal) => {
  const recharts = await importOriginal<typeof import('recharts')>();

  return {
    ...recharts,
    Bar: () => null,
    BarChart: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    CartesianGrid: () => null,
    Legend: () => null,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    Tooltip: (props: {
      allowEscapeViewBox?: { x?: boolean; y?: boolean };
      reverseDirection?: { x?: boolean; y?: boolean };
    }) => (
      <div
        data-testid='chart-tooltip'
        data-allow-escape-x={props.allowEscapeViewBox?.x}
        data-allow-escape-y={props.allowEscapeViewBox?.y}
        data-reverse-direction-x={props.reverseDirection?.x}
        data-reverse-direction-y={props.reverseDirection?.y}
      />
    ),
    XAxis: () => null,
    YAxis: () => null,
  };
});

const model: ChartModel = {
  series: [
    { id: 'branch-1', name: 'Branch 1' },
    { id: 'branch-2', name: 'Branch 2' },
  ],
  data: [
    {
      period: 'Feb 2024',
      values: { 'branch-1': 1200, 'branch-2': 800 },
    },
  ],
};

describe('Chart', () => {
  it('provides a mobile scrolling chart with a tooltip contained by the viewbox', () => {
    render(<Chart model={model} title='Company' />);

    const scrollRegion = screen.getByTestId('chart-scroll-region');

    expect(scrollRegion.getAttribute('role')).toBe('region');
    expect(scrollRegion.getAttribute('aria-label')).toBe('Scrollable values over time for Company');
    expect(scrollRegion.firstElementChild?.classList.contains('min-w-[760px]')).toBe(true);
    const tooltip = screen.getByTestId('chart-tooltip');

    expect(tooltip.getAttribute('data-allow-escape-x')).toBe('false');
    expect(tooltip.getAttribute('data-allow-escape-y')).toBe('false');
    expect(tooltip.getAttribute('data-reverse-direction-x')).toBe('true');
    expect(tooltip.getAttribute('data-reverse-direction-y')).toBe('false');
  });
});
