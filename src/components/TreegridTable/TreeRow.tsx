import { ChevronDown, ChevronRight } from 'lucide-react';
import { memo, type MouseEvent } from 'react';
import type { VisibleTreeRow } from '../../types';
import { EmployeeAvatar } from './EmployeeAvatar';

type Props = {
  row: VisibleTreeRow;
  selected: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onNameRefChange: (id: string, element: HTMLButtonElement | null) => void;
};

const TreeRowComponent = ({
  row,
  selected,
  onToggle,
  onSelect,
  onNameRefChange: onNameRefChangeProp,
}: Props) => {
  const hasChildren = Boolean(row.node.children?.length);

  const onNameButtonClick = () => {
    onSelect(row.node.id);
  };

  const onExpandButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggle(row.node.id);
  };

  const onNameRefChange = (element: HTMLButtonElement | null) => {
    onNameRefChangeProp(row.node.id, element);
  };

  const rowClassName = 'bg-surface transition-colors hover:bg-row-hover';

  return (
    <tr
      role='row'
      data-node-id={row.node.id}
      data-testid={`treegrid-row-${row.node.id}`}
      aria-level={row.level}
      {...(hasChildren ? { 'aria-expanded': row.isExpanded } : {})}
      className={rowClassName}
    >
      <th
        className='h-14 border-b border-border-subtle py-[18px] pr-6 pl-4 text-left font-normal'
        role='rowheader'
        scope='row'
      >
        <div
          className='flex min-w-[264px] items-center gap-2'
          style={{ paddingInlineStart: `${(row.level - 1) * 1.25}rem` }}
        >
          {hasChildren ? (
            <button
              className='grid size-4 shrink-0 cursor-pointer place-items-center rounded-sm text-foreground transition-colors hover:bg-foreground/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground'
              type='button'
              data-testid={`treegrid-toggle-${row.node.id}`}
              aria-label={`${row.isExpanded ? 'Collapse' : 'Expand'} ${row.node.name}`}
              aria-expanded={row.isExpanded}
              onClick={onExpandButtonClick}
            >
              {row.isExpanded ? (
                <ChevronDown aria-hidden='true' size={16} />
              ) : (
                <ChevronRight aria-hidden='true' size={16} />
              )}
            </button>
          ) : (
            <span className='size-4 shrink-0' aria-hidden='true' />
          )}
          {row.node.kind === 'employee' && <EmployeeAvatar name={row.node.name} />}
          {row.node.kind === 'channel' && <span className='size-2 shrink-0' aria-hidden='true' />}
          <button
            ref={onNameRefChange}
            className='cursor-pointer rounded-sm text-left text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground'
            type='button'
            data-testid={`treegrid-select-${row.node.id}`}
            aria-current={selected ? 'true' : undefined}
            onClick={onNameButtonClick}
          >
            {row.node.name}
          </button>
        </div>
      </th>
      {row.node.values.map((value, index) => (
        <td
          className='h-14 border-b border-border-subtle py-[18px] pr-6 text-right text-foreground'
          role='gridcell'
          data-testid={`treegrid-value-${row.node.id}-${index}`}
          key={index}
        >
          {value.toLocaleString()}
        </td>
      ))}
    </tr>
  );
};

export const TreeRow = memo(
  TreeRowComponent,
  (previous, next) =>
    previous.row.node === next.row.node &&
    previous.row.level === next.row.level &&
    previous.row.isExpanded === next.row.isExpanded &&
    previous.selected === next.selected &&
    previous.onToggle === next.onToggle &&
    previous.onSelect === next.onSelect &&
    previous.onNameRefChange === next.onNameRefChange,
);
