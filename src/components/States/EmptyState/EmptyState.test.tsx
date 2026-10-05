import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { EmptyState } from './index';

afterEach(cleanup);

describe('EmptyState', () => {
  it('announces that reporting periods are unavailable', () => {
    render(<EmptyState />);

    const emptyState = screen.getByTestId('empty-state');

    expect(emptyState.getAttribute('role')).toBe('status');
    expect(emptyState.textContent).toContain('No client values yet');
    expect(emptyState.textContent).toContain('There are no reporting periods available');
    expect(emptyState.querySelector('svg')?.classList.contains('text-foreground-muted')).toBe(true);
  });
});
