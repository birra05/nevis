import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CompanyNode } from '../../types';
import { TreegridTable } from '.';

const root: CompanyNode = {
  id: 'company',
  name: 'Company',
  nodeType: 'company',
  children: [
    {
      id: 'branch',
      name: 'Branch 1',
      nodeType: 'branch',
      children: [
        {
          id: 'employee',
          name: 'Anna Blackwood',
          nodeType: 'employee',
          avatarUrl: '/assets/avatars/employee.png',
          children: [{ id: 'channel', name: 'Existing clients', nodeType: 'channel' }],
        },
        {
          id: 'empty-employee',
          name: 'James Walker',
          nodeType: 'employee',
          avatarUrl: '/assets/avatars/empty-employee.png',
          children: [],
        },
      ],
    },
    {
      id: 'empty-branch',
      name: 'Branch 2',
      nodeType: 'branch',
      children: [],
    },
  ],
};

const periods = [{ date: '2024-02-01', label: 'Feb 2024' }];
const valuesByNodeId = new Map<string, readonly number[]>([
  ['company', [100]],
  ['branch', [50]],
  ['employee', [25]],
  ['channel', [20]],
  ['empty-employee', [12]],
  ['empty-branch', [76]],
]);

afterEach(cleanup);

describe('TreegridTable', () => {
  it('selects and toggles parent rows from every pointer-accessible surface', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <TreegridTable
        root={root}
        periods={periods}
        valuesByNodeId={valuesByNodeId}
        selectedId='company'
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByTestId('treegrid-select-branch'));
    expect(onSelect).toHaveBeenCalledWith('branch');
    expect(screen.getByTestId('treegrid-row-employee')).toBeTruthy();
    expect(
      screen
        .getByTestId('treegrid-toggle-branch')
        .querySelector('svg')
        ?.classList.contains('lucide-chevron-down'),
    ).toBe(true);

    await user.click(screen.getByTestId('treegrid-value-branch-0'));
    expect(onSelect).toHaveBeenLastCalledWith('branch');
    expect(screen.queryByTestId('treegrid-row-employee')).toBeNull();

    await user.click(screen.getByTestId('treegrid-toggle-branch'));
    expect(onSelect).toHaveBeenLastCalledWith('branch');
    expect(screen.getByTestId('treegrid-row-employee')).toBeTruthy();
    expect(
      screen
        .getByTestId('treegrid-row-employee')
        .querySelector('[data-testid="employee-avatar-image"]')
        ?.getAttribute('src'),
    ).toBe('/assets/avatars/employee.png');

    await user.click(screen.getByTestId('treegrid-row-empty-branch'));
    expect(onSelect).toHaveBeenLastCalledWith('empty-branch');
  });

  it('keeps Company expanded and selected when it first renders', () => {
    render(
      <TreegridTable
        root={root}
        periods={periods}
        valuesByNodeId={valuesByNodeId}
        selectedId='company'
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByTestId('treegrid-row-company').getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByTestId('treegrid-select-company').getAttribute('aria-current')).toBe('true');
    expect(screen.getByRole('region', { name: 'Scrollable client values' })).toBeTruthy();
  });

  it('keeps period headers on one line with space for their padded label', () => {
    render(
      <TreegridTable
        root={root}
        periods={periods}
        valuesByNodeId={valuesByNodeId}
        selectedId='company'
        onSelect={vi.fn()}
      />,
    );

    const periodHeader = screen.getByRole('columnheader', { name: 'Feb 2024' });

    expect(periodHeader.classList.contains('min-w-[88px]')).toBe(true);
    expect(periodHeader.classList.contains('whitespace-nowrap')).toBe(true);
  });

  it('selects from a name keyboard activation without changing expansion', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <TreegridTable
        root={root}
        periods={periods}
        valuesByNodeId={valuesByNodeId}
        selectedId='company'
        onSelect={onSelect}
      />,
    );

    screen.getByTestId('treegrid-select-branch').focus();
    await user.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledWith('branch');
    expect(screen.queryByTestId('treegrid-row-employee')).toBeNull();
  });

  it('aligns leaf labels with their parent level', async () => {
    const user = userEvent.setup();

    render(
      <TreegridTable
        root={root}
        periods={periods}
        valuesByNodeId={valuesByNodeId}
        selectedId='company'
        onSelect={vi.fn()}
      />,
    );

    await user.click(screen.getByTestId('treegrid-toggle-branch'));
    await user.click(screen.getByTestId('treegrid-toggle-employee'));

    const employeeLabelRow = screen.getByTestId('treegrid-row-employee');
    const channelLabelRow = screen.getByTestId('treegrid-row-channel');

    expect(screen.getByTestId('treegrid-avatar-spacer-channel')).toBeTruthy();
    expect(channelLabelRow.querySelector('div')?.getAttribute('style')).toBe(
      employeeLabelRow.querySelector('div')?.getAttribute('style'),
    );
  });

  it('keeps empty employee labels aligned without rendering a toggle', async () => {
    const user = userEvent.setup();

    render(
      <TreegridTable
        root={root}
        periods={periods}
        valuesByNodeId={valuesByNodeId}
        selectedId='company'
        onSelect={vi.fn()}
      />,
    );

    await user.click(screen.getByTestId('treegrid-toggle-branch'));

    expect(screen.queryByTestId('treegrid-toggle-empty-employee')).toBeNull();
    expect(
      screen.getByTestId('treegrid-row-empty-employee').querySelector('div')?.getAttribute('style'),
    ).toBe(screen.getByTestId('treegrid-row-employee').querySelector('div')?.getAttribute('style'));
  });

  it('keeps empty branches aligned without reserving an avatar slot', () => {
    render(
      <TreegridTable
        root={root}
        periods={periods}
        valuesByNodeId={valuesByNodeId}
        selectedId='company'
        onSelect={vi.fn()}
      />,
    );

    expect(screen.queryByTestId('treegrid-toggle-empty-branch')).toBeNull();
    expect(screen.queryByTestId('treegrid-avatar-spacer-branch')).toBeNull();
    expect(
      screen.getByTestId('treegrid-row-empty-branch').querySelector('div')?.getAttribute('style'),
    ).toBe(screen.getByTestId('treegrid-row-branch').querySelector('div')?.getAttribute('style'));
  });

  it('exposes treegrid semantics and supports arrow-key collapse', async () => {
    const user = userEvent.setup();

    render(
      <TreegridTable
        root={root}
        periods={periods}
        valuesByNodeId={valuesByNodeId}
        selectedId='company'
        onSelect={vi.fn()}
      />,
    );

    await user.click(screen.getByTestId('treegrid-select-company'));
    await user.keyboard('{ArrowLeft}');

    expect(screen.getByTestId('treegrid-table').getAttribute('role')).toBe('treegrid');
    expect(screen.getByTestId('treegrid-row-company').getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByTestId('treegrid-row-branch')).toBeNull();
  });

  it.each(['treegrid-select-branch', 'treegrid-toggle-branch'])(
    'moves from %s with every documented arrow-key destination',
    async (controlTestId) => {
      const user = userEvent.setup();

      render(
        <TreegridTable
          root={root}
          periods={periods}
          valuesByNodeId={valuesByNodeId}
          selectedId='company'
          onSelect={vi.fn()}
        />,
      );

      await user.click(screen.getByTestId('treegrid-toggle-branch'));
      const control = screen.getByTestId(controlTestId);

      control.focus();
      await user.keyboard('{ArrowDown}');
      expect(document.activeElement).toBe(screen.getByTestId('treegrid-select-employee'));

      control.focus();
      await user.keyboard('{ArrowUp}');
      expect(document.activeElement).toBe(screen.getByTestId('treegrid-select-company'));

      control.focus();
      await user.keyboard('{Home}');
      expect(document.activeElement).toBe(screen.getByTestId('treegrid-select-company'));

      control.focus();
      await user.keyboard('{End}');
      expect(document.activeElement).toBe(screen.getByTestId('treegrid-select-empty-branch'));

      control.focus();
      await user.keyboard('{ArrowLeft}');
      expect(screen.queryByTestId('treegrid-row-employee')).toBeNull();

      control.focus();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByTestId('treegrid-row-employee')).toBeTruthy();

      control.focus();
      await user.keyboard('{ArrowRight}');
      expect(document.activeElement).toBe(screen.getByTestId('treegrid-select-employee'));
    },
  );

  it('keeps a leaf unchanged when ArrowRight has no destination', async () => {
    const user = userEvent.setup();

    render(
      <TreegridTable
        root={root}
        periods={periods}
        valuesByNodeId={valuesByNodeId}
        selectedId='company'
        onSelect={vi.fn()}
      />,
    );

    const leaf = screen.getByTestId('treegrid-select-empty-branch');
    leaf.focus();
    await user.keyboard('{ArrowRight}');

    expect(document.activeElement).toBe(leaf);
  });
});
