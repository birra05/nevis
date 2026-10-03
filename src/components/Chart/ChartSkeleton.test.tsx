import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChartSkeleton } from './index';

describe('ChartSkeleton', () => {
  it('renders a decorative chart placeholder', () => {
    render(<ChartSkeleton />);

    expect(screen.getByTestId('chart-skeleton').getAttribute('aria-hidden')).toBe('true');
  });
});
