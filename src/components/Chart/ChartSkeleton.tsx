import type { FC } from 'react';

const chartBarHeights = ['38%', '56%', '46%', '70%', '52%', '82%', '64%', '74%', '48%', '60%'];

export const ChartSkeleton: FC = () => {
  return (
    <section
      className='rounded-lg bg-surface px-4 pt-6 pb-4'
      data-testid='chart-skeleton'
      aria-hidden='true'
    >
      <div className='relative h-[280px] overflow-hidden sm:h-[358px]'>
        <div className='absolute inset-x-0 top-4 bottom-8 flex flex-col justify-between'>
          {[0, 1, 2, 3, 4].map((line) => (
            <div className='border-t border-dashed border-border-subtle' key={line} />
          ))}
        </div>
        <div className='absolute right-4 bottom-8 left-10 flex h-[calc(100%-3rem)] items-end justify-around gap-2'>
          {chartBarHeights.map((height, index) => (
            <div
              className='w-full max-w-10 rounded-t-sm bg-row-hover animate-pulse'
              key={index}
              style={{ height }}
            />
          ))}
        </div>
        <div className='absolute right-4 bottom-0 left-10 flex justify-around gap-2'>
          {chartBarHeights.map((_, index) => (
            <div className='h-2 w-8 rounded-sm bg-border-subtle' key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
