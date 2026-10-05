import { useEffect, useState } from 'react';
import type { AnalyticsPayload, AnalyticsView } from '../../types.ts';
import { toAnalyticsView } from '../index.ts';

export type DashboardDataState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'empty' }
  | { kind: 'ready'; analytics: AnalyticsView };

export const useDashboardData = () => {
  const [state, setState] = useState<DashboardDataState>({ kind: 'loading' });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch('/api/business-overview');

        if (!response.ok) {
          throw new Error('The dashboard data could not be loaded');
        }

        const payload = (await response.json()) as AnalyticsPayload;

        if (payload.matrix.length === 0) {
          setState({ kind: 'empty' });
          return;
        }

        setState({ kind: 'ready', analytics: toAnalyticsView(payload) });
      } catch (error: unknown) {
        setState({
          kind: 'error',
          message:
            error instanceof Error ? error.message : 'The dashboard data could not be loaded',
        });
      }
    };

    void loadDashboard();
  }, [retryCount]);

  const retry = () => {
    setState({ kind: 'loading' });
    setRetryCount((count) => count + 1);
  };

  return { state, retry };
};
