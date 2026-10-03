import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorState } from './index';

afterEach(cleanup);

describe('ErrorState', () => {
  it('shows an error and retries on request', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(<ErrorState message='The dashboard data could not be loaded.' onRetry={onRetry} />);

    expect(screen.getByTestId('error-state').textContent).toContain('could not be loaded');
    expect(screen.getByTestId('error-retry-button').classList.contains('h-11')).toBe(true);
    await user.click(screen.getByTestId('error-retry-button'));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
