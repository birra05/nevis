import type { AnalyticsPayload, AnalyticsView } from '../../types.ts';
import { formatPeriodLabel } from './date.ts';

export const toAnalyticsView = (payload: AnalyticsPayload): AnalyticsView => {
  const periods = payload.matrix.map(({ date }) => ({ date, label: formatPeriodLabel(date) }));
  const valuesByNodeId = new Map<string, readonly number[]>();

  for (const id of Object.keys(payload.matrix[0]?.values ?? {})) {
    valuesByNodeId.set(
      id,
      payload.matrix.map(({ values }) => values[id]),
    );
  }

  return { payload, periods, valuesByNodeId };
};
