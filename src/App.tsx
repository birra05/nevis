import { useState, FC } from 'react';
import { Chart, ChartSkeleton } from './components/Chart';
import { EmptyState, ErrorState } from './components/States';
import { TreegridSkeleton, TreegridTable } from './components/TreegridTable';
import { findNode, toChartModel } from './utils';
import { useDashboardData } from './utils/hooks';

export const App: FC = () => {
  const [selectedId, setSelectedId] = useState<string>();
  const { state, retry } = useDashboardData();

  const selected =
    state.kind === 'ready'
      ? (findNode(state.analytics.payload.tree, selectedId ?? state.analytics.payload.tree.id) ??
        state.analytics.payload.tree)
      : undefined;

  if (state.kind === 'loading') {
    return (
      <main className='min-h-dvh bg-canvas px-4 py-6 sm:px-6 sm:py-8'>
        <div className='mx-auto flex w-full max-w-[1408px] flex-col gap-4' role='status'>
          <span className='sr-only'>Loading clients…</span>
          <ChartSkeleton />
          <TreegridSkeleton />
        </div>
      </main>
    );
  }

  if (state.kind === 'error') {
    return (
      <main className='min-h-dvh bg-canvas px-4 py-6 sm:px-6 sm:py-8'>
        <ErrorState message={state.message} onRetry={retry} />
      </main>
    );
  }

  if (state.kind === 'empty') {
    return (
      <main className='min-h-dvh bg-canvas px-4 py-6 sm:px-6 sm:py-8'>
        <EmptyState />
      </main>
    );
  }

  return (
    <main className='min-h-dvh bg-canvas px-4 py-6 sm:px-6 sm:py-8'>
      <div className='mx-auto flex w-full max-w-[1408px] flex-col gap-4'>
        <header>
          <h1 className='font-display text-[clamp(1.875rem,4vw,2.1875rem)] leading-[1.25] font-normal tracking-[-0.02em]'>
            Clients
          </h1>
        </header>
        <p className='sr-only' aria-live='polite'>
          Client values updated for {selected!.name}.
        </p>
        <Chart
          title={selected!.name}
          model={toChartModel(selected!, state.analytics.periods, state.analytics.valuesByNodeId)}
        />
        <TreegridTable
          key={state.analytics.payload.tree.id}
          root={state.analytics.payload.tree}
          periods={state.analytics.periods}
          valuesByNodeId={state.analytics.valuesByNodeId}
          selectedId={selected!.id}
          onSelect={setSelectedId}
        />
      </div>
    </main>
  );
};
