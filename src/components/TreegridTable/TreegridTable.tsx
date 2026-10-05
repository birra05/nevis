import { useCallback, useMemo, useRef, useState } from 'react';
import type { FC, KeyboardEvent } from 'react';
import { isParentNode, type Period, type TreeNode, type VisibleTreeRow } from '../../types';
import { flattenVisibleRows } from '../../utils';
import { TreeRow } from './TreeRow';

type TreegridTableProps = {
  root: TreeNode;
  periods: readonly Period[];
  valuesByNodeId: ReadonlyMap<string, readonly number[]>;
  selectedId: string;
  onSelect: (id: string) => void;
};

export const TreegridTable: FC<TreegridTableProps> = ({
  root,
  periods,
  valuesByNodeId,
  selectedId,
  onSelect,
}: TreegridTableProps) => {
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(() => new Set([root.id]));
  const rowRefs = useRef(new Map<string, HTMLButtonElement>());

  const toggle = useCallback((id: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  const focusRow = (id: string) => rowRefs.current.get(id)?.focus();

  const onNameRefChange = useCallback((id: string, element: HTMLButtonElement | null) => {
    if (element) {
      rowRefs.current.set(id, element);
    } else {
      rowRefs.current.delete(id);
    }
  }, []);

  const rows = useMemo(() => flattenVisibleRows(root, expandedIds), [root, expandedIds]);

  const parentId = useMemo(() => {
    const parents = new Map<string, string>();
    const visit = (node: TreeNode) =>
      (isParentNode(node) ? node.children : []).forEach((child) => {
        parents.set(child.id, node.id);
        visit(child);
      });

    visit(root);
    return parents;
  }, [root]);

  const handleArrowDown = (event: KeyboardEvent<HTMLTableElement>, index: number) => {
    event.preventDefault();
    focusRow(rows[index + 1]?.node.id);
  };

  const handleArrowUp = (event: KeyboardEvent<HTMLTableElement>, index: number) => {
    event.preventDefault();
    focusRow(rows[index - 1]?.node.id);
  };

  const handleArrowRight = (event: KeyboardEvent<HTMLTableElement>, row: VisibleTreeRow) => {
    const firstChildId = isParentNode(row.node) ? row.node.children[0]?.id : undefined;

    if (!firstChildId) {
      return;
    }

    event.preventDefault();

    if (row.isExpanded) {
      focusRow(firstChildId);
      return;
    }

    toggle(row.node.id);
  };

  const handleArrowLeft = (event: KeyboardEvent<HTMLTableElement>, row: VisibleTreeRow) => {
    event.preventDefault();

    if (isParentNode(row.node) && row.node.children.length > 0 && row.isExpanded) {
      toggle(row.node.id);
      return;
    }

    focusRow(parentId.get(row.node.id) ?? row.node.id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
    const row = (event.target as HTMLElement).closest<HTMLTableRowElement>('tr[data-node-id]');

    if (!row) {
      return;
    }

    const id = row.dataset.nodeId!;
    const index = rows.findIndex((item) => item.node.id === id);
    const current = rows[index];

    switch (event.key) {
      case 'ArrowDown':
        handleArrowDown(event, index);
        return;
      case 'ArrowUp':
        handleArrowUp(event, index);
        return;
      case 'Home':
        event.preventDefault();
        focusRow(rows[0].node.id);
        return;
      case 'End':
        event.preventDefault();
        focusRow(rows.at(-1)?.node.id ?? id);
        return;
      case 'ArrowRight':
        handleArrowRight(event, current);
        return;
      case 'ArrowLeft':
        handleArrowLeft(event, current);
        return;
    }
  };

  return (
    <section className='overflow-hidden rounded-lg bg-surface' aria-labelledby='table-heading'>
      <h2 id='table-heading' className='sr-only'>
        Book of business hierarchy
      </h2>
      <p className='sr-only'>Use arrow keys to move. Right and left expand or collapse branches.</p>
      <p className='px-4 py-3 text-sm text-foreground-muted sm:hidden'>
        Scroll horizontally to view all client values
      </p>
      <div className='w-full overflow-x-auto' role='region' aria-label='Scrollable client values'>
        <table
          className='w-full min-w-[760px] border-collapse text-sm tabular-nums'
          data-testid='treegrid-table'
          role='treegrid'
          aria-label='Book of business hierarchy'
          aria-rowcount={rows.length}
          onKeyDown={onKeyDown}
        >
          <thead>
            <tr role='row'>
              <th
                className='h-14 min-w-[264px] border-b border-border-subtle bg-surface py-4 pr-6 pl-4 text-left font-normal'
                role='columnheader'
                scope='col'
              >
                Name
              </th>
              {periods.map((period) => (
                <th
                  className='h-14 min-w-[88px] whitespace-nowrap border-b border-border-subtle bg-surface py-4 pr-6 text-right font-normal text-foreground-muted'
                  role='columnheader'
                  scope='col'
                  key={period.date}
                >
                  {period.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody role='rowgroup'>
            {rows.map((row) => (
              <TreeRow
                key={row.node.id}
                row={row}
                selected={row.node.id === selectedId}
                values={valuesByNodeId.get(row.node.id) ?? []}
                onToggle={toggle}
                onSelect={onSelect}
                onNameRefChange={onNameRefChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
