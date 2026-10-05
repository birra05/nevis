import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { FC } from 'react';
import type { ChartModel } from '../../types';

interface ChartProps {
  model: ChartModel;
  title: string;
}

const hierarchySeriesColors = [
  'var(--color-chart-series-1)',
  'var(--color-chart-series-2)',
  'var(--color-chart-series-3)',
] as const;

type BarRadius = [number, number, number, number];

const STACKED_BAR_RADIUS = 4;
const CHART_TICK_FONT_SIZE = 12;

const getBarRadius = (index: number, seriesCount: number): BarRadius => {
  const topRadius = index === seriesCount - 1 ? STACKED_BAR_RADIUS : 0;
  const bottomRadius = index === 0 ? STACKED_BAR_RADIUS : 0;

  return [topRadius, topRadius, bottomRadius, bottomRadius];
};

export const Chart: FC<ChartProps> = ({ model, title }) => {
  const data = model.data.map(({ period, values }) => ({ period, ...values }));

  return (
    <section className='rounded-lg bg-surface px-2 pt-6 pb-4' aria-labelledby='chart-heading'>
      <h2 id='chart-heading' className='sr-only'>
        Client values for {title}
      </h2>
      <p className='px-2 pb-3 text-sm text-foreground-muted sm:hidden'>
        Scroll horizontally to view all periods
      </p>
      <div
        className='w-full overflow-x-auto'
        data-testid='chart-scroll-region'
        role='region'
        aria-label={`Scrollable values over time for ${title}`}
      >
        <div
          className='h-[280px] min-w-[760px] sm:h-[358px] sm:min-w-0'
          role='img'
          aria-label={`Values over time for ${title}`}
        >
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data}>
              <CartesianGrid
                stroke='var(--color-chart-grid)'
                strokeDasharray='3 3'
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey='period'
                tick={{ fill: 'var(--color-foreground-muted)', fontSize: CHART_TICK_FONT_SIZE }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: 'var(--color-foreground-muted)', fontSize: CHART_TICK_FONT_SIZE }}
                tickLine={false}
                width={38}
              />
              <Tooltip
                allowEscapeViewBox={{ x: false, y: false }}
                cursor={{ fill: 'var(--color-row-hover)' }}
                reverseDirection={{ x: true, y: false }}
              />
              <Legend
                iconSize={8}
                wrapperStyle={{ fontSize: CHART_TICK_FONT_SIZE, paddingTop: 16 }}
              />
              {model.series.map((series, index) => (
                <Bar
                  key={series.id}
                  dataKey={series.id}
                  name={series.name}
                  stackId='values'
                  fill={hierarchySeriesColors[index % hierarchySeriesColors.length]}
                  radius={getBarRadius(index, model.series.length)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};
