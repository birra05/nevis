import { ChevronDown, ChevronRight } from 'lucide-react';
import { memo, type FC, type MouseEvent } from 'react';
import { isParentNode, type VisibleTreeRow } from '../../types';
import { EmployeeAvatar } from './EmployeeAvatar';

type TreeRowProps = {
  row: VisibleTreeRow;
  selected: boolean;
  values: readonly number[];
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onNameRefChange: (id: string, element: HTMLButtonElement | null) => void;
};

const ROOT_TREE_LEVEL = 1;
const TREE_LEVEL_INDENT_REM = 1.25;

const getIndentLevel = (level: number, isChannel: boolean) =>
  isChannel ? Math.max(ROOT_TREE_LEVEL, level - 1) : level;

export const TreeRow: FC<TreeRowProps> = memo(
  ({ row, selected, values, onToggle, onSelect, onNameRefChange }) => {
    const hasChildren = isParentNode(row.node) && row.node.children.length > 0;
    const indentLevel = getIndentLevel(row.level, row.node.nodeType === 'channel');

    const rowClassName =
      'cursor-pointer bg-surface transition-colors duration-200 hover:bg-row-hover';

    const handleRowClick = () => {
      onSelect(row.node.id);

      if (hasChildren) {
        onToggle(row.node.id);
      }
    };

    const handleNameButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
      if (event.detail === 0) {
        event.stopPropagation();
        onSelect(row.node.id);
      }
    };

    const handleNameRefChange = (element: HTMLButtonElement | null) => {
      onNameRefChange(row.node.id, element);
    };

    return (
      <tr
        role='row'
        data-node-id={row.node.id}
        data-testid={`treegrid-row-${row.node.id}`}
        aria-level={row.level}
        {...(hasChildren ? { 'aria-expanded': row.isExpanded } : {})}
        className={rowClassName}
        onClick={handleRowClick}
      >
        <th
          className='h-14 border-b border-border-subtle py-2 pr-6 pl-4 text-left font-normal'
          role='rowheader'
          scope='row'
        >
          <div
            className='flex min-w-0 items-center gap-2'
            style={{
              paddingInlineStart: `${(indentLevel - ROOT_TREE_LEVEL) * TREE_LEVEL_INDENT_REM}rem`,
            }}
          >
            {hasChildren ? (
              <button
                className='grid size-10 shrink-0 cursor-pointer place-items-center rounded-sm text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground'
                type='button'
                data-testid={`treegrid-toggle-${row.node.id}`}
                aria-label={`${row.isExpanded ? 'Collapse' : 'Expand'} ${row.node.name}`}
                aria-expanded={row.isExpanded}
              >
                {row.isExpanded ? (
                  <ChevronDown aria-hidden='true' size={16} />
                ) : (
                  <ChevronRight aria-hidden='true' size={16} />
                )}
              </button>
            ) : (
              <span className='size-10 shrink-0' aria-hidden='true' />
            )}
            {row.node.nodeType === 'employee' && (
              <EmployeeAvatar name={row.node.name} avatarUrl={row.node.avatarUrl} />
            )}
            {row.node.nodeType === 'channel' && (
              <span
                className='size-5 shrink-0'
                aria-hidden='true'
                data-testid={`treegrid-avatar-spacer-${row.node.id}`}
              />
            )}
            <button
              ref={handleNameRefChange}
              className='cursor-pointer rounded-sm text-left text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground'
              type='button'
              data-testid={`treegrid-select-${row.node.id}`}
              aria-current={selected ? 'true' : undefined}
              onClick={handleNameButtonClick}
            >
              {row.node.name}
            </button>
          </div>
        </th>
        {values.map((value, index) => (
          <td
            className='h-14 border-b border-border-subtle py-2 pr-6 text-right text-foreground'
            role='gridcell'
            data-testid={`treegrid-value-${row.node.id}-${index}`}
            key={index}
          >
            {value.toLocaleString()}
          </td>
        ))}
      </tr>
    );
  },
);
