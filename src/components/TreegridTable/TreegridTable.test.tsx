import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { TreeNode } from '../../types';
import { TreegridTable } from '.';

const root: TreeNode = {
  id: 'company',
  name: 'Company',
  values: [100],
  children: [
    {
      id: 'branch',
      name: 'Branch 1',
      values: [50],
      children: [{ id: 'employee', kind: 'employee', name: 'Anna Blackwood', values: [25] }],
    },
  ],
};

afterEach(cleanup);

describe('TreegridTable', () => {
  it('only selects from the name and only expands from the arrow', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <TreegridTable root={root} timeSlots={['Feb']} selectedId='company' onSelect={onSelect} />,
    );

    await user.click(screen.getByTestId('treegrid-value-branch-0'));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.queryByTestId('treegrid-row-employee')).toBeNull();

    await user.click(screen.getByTestId('treegrid-select-branch'));
    expect(onSelect).toHaveBeenCalledWith('branch');
    expect(screen.queryByTestId('treegrid-row-employee')).toBeNull();

    await user.click(screen.getByTestId('treegrid-toggle-branch'));
    expect(screen.getByTestId('treegrid-row-employee')).toBeTruthy();
    expect(screen.getByTestId('employee-avatar').textContent).toBe('AB');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('keeps the default table background when the company is selected and expanded', () => {
    render(
      <TreegridTable root={root} timeSlots={['Feb']} selectedId='company' onSelect={vi.fn()} />,
    );

    const companyRow = screen.getByTestId('treegrid-row-company');

    expect(companyRow.classList.contains('bg-surface')).toBe(true);
    expect(companyRow.getAttribute('aria-expanded')).toBe('true');
  });

  it('exposes treegrid semantics and supports arrow-key expansion', async () => {
    const user = userEvent.setup();

    render(
      <TreegridTable root={root} timeSlots={['Feb']} selectedId='company' onSelect={vi.fn()} />,
    );

    const company = screen.getByTestId('treegrid-select-company');
    await user.click(company);
    await user.keyboard('{ArrowLeft}');

    const table = screen.getByTestId('treegrid-table');

    expect(table.tagName).toBe('TABLE');
    expect(table.getAttribute('role')).toBe('treegrid');
    expect(screen.getByTestId('treegrid-row-company').getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByTestId('treegrid-row-branch')).toBeNull();
  });
});
