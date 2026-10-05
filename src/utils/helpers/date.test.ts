import { describe, expect, it } from 'vitest';
import { formatPeriodLabel } from './date.ts';

describe('formatPeriodLabel', () => {
  it('uses the fixed English month map', () => {
    expect(formatPeriodLabel('2024-02-01')).toBe('Feb 2024');
    expect(formatPeriodLabel('2025-01-01')).toBe('Jan 2025');
  });
});
