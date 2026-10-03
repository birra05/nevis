import { useEffect, useState } from 'react';
import type { DashboardData } from '../../types.js';
import { validateData } from '../index.js';

export type DashboardDataState =
  { kind: 'loading' } | { kind: 'error'; message: string } | { kind: 'ready'; book: DashboardData };

export const useDashboardData = () => {
  const [state, setState] = useState<DashboardDataState>({ kind: 'loading' });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetch('/api/business-overview')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('The dashboard data could not be loaded.');
        }

        return response.json() as Promise<DashboardData>;
      })
      .then((book) => {
        const error = validateData(book);

        if (error) {
          throw new Error(error);
        }

        setState({ kind: 'ready', book });
      })
      .catch((error: unknown) => {
        setState({
          kind: 'error',
          message:
            error instanceof Error ? error.message : 'The dashboard data could not be loaded.',
        });
      });
  }, [retryCount]);

  const retry = () => {
    setState({ kind: 'loading' });
    setRetryCount((count) => count + 1);
  };

  return { state, retry };
};
