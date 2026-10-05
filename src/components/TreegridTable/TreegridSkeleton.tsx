import type { FC } from 'react';

const tableRows = [
  { nameWidth: 'w-36', valueWidth: 'w-8' },
  { nameWidth: 'w-28', valueWidth: 'w-10' },
  { nameWidth: 'w-40', valueWidth: 'w-7' },
  { nameWidth: 'w-32', valueWidth: 'w-9' },
  { nameWidth: 'w-24', valueWidth: 'w-8' },
  { nameWidth: 'w-36', valueWidth: 'w-10' },
];
const tableColumnCount = 12;

export const TreegridSkeleton: FC = () => {
  return (
    <section
      className='overflow-hidden rounded-lg bg-surface'
      data-testid='treegrid-skeleton'
      aria-hidden='true'
    >
      <div className='w-full overflow-x-auto'>
        <div className='min-w-[760px] animate-pulse'>
          <div className='flex h-14 border-b border-border-subtle px-4'>
            <div className='flex min-w-[264px] flex-1 items-center'>
              <div className='h-3 w-12 rounded-sm bg-border-subtle' />
            </div>
            {Array.from({ length: tableColumnCount }, (_, index) => (
              <div className='flex w-[88px] shrink-0 items-center justify-end pr-6' key={index}>
                <div className='h-3 w-10 rounded-sm bg-border-subtle' />
              </div>
            ))}
          </div>
          {tableRows.map(({ nameWidth, valueWidth }, rowIndex) => (
            <div className='flex h-14 border-b border-border-subtle px-4' key={rowIndex}>
              <div className='flex min-w-[264px] flex-1 items-center gap-2'>
                <div className='size-4 rounded-sm bg-border-subtle' />
                <div className={`h-3 rounded-sm bg-row-hover ${nameWidth}`} />
              </div>
              {Array.from({ length: tableColumnCount }, (_, columnIndex) => (
                <div
                  className='flex w-[88px] shrink-0 items-center justify-end pr-6'
                  key={columnIndex}
                >
                  <div className={`h-3 rounded-sm bg-row-hover ${valueWidth}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
