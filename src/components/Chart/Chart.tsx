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
import type { ChartModel } from '../../types';

interface ChartProps {
  model: ChartModel;
  title: string;
}

const chartColors = [
  'var(--color-chart-existing)',
  'var(--color-chart-organic)',
  'var(--color-chart-paid)',
] as const;

type BarRadius = [number, number, number, number];

const getBarRadius = (index: number, seriesCount: number): BarRadius => {
  const topRadius = index === seriesCount - 1 ? 4 : 0;
  const bottomRadius = index === 0 ? 4 : 0;

  return [topRadius, topRadius, bottomRadius, bottomRadius];
};

export const Chart = ({ model, title }: ChartProps) => {
  const data = model.data.map(({ timeSlot, values }) => ({ timeSlot, ...values }));

  return (
    <section className='rounded-lg bg-surface px-2 pt-6 pb-4' aria-labelledby='chart-heading'>
      <h2 id='chart-heading' className='sr-only'>
        Client values for {title}
      </h2>
      <div
        className='h-[280px] sm:h-[358px]'
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
              dataKey='timeSlot'
              tick={{ fill: 'var(--color-foreground-muted)', fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: 'var(--color-foreground-muted)', fontSize: 12 }}
              tickLine={false}
              width={38}
            />
            <Tooltip cursor={{ fill: 'var(--color-row-hover)' }} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
            {model.series.map((series, index) => (
              <Bar
                key={series.id}
                dataKey={series.id}
                name={series.name}
                stackId='values'
                fill={chartColors[index % chartColors.length]}
                radius={getBarRadius(index, model.series.length)}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
