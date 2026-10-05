import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TreegridSkeleton } from './index';

describe('TreegridSkeleton', () => {
  it('renders a decorative table placeholder', () => {
    render(<TreegridSkeleton />);

    expect(screen.getByTestId('treegrid-skeleton').getAttribute('aria-hidden')).toBe('true');
  });
});
