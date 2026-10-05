import express from 'express';
import { readFile } from 'node:fs/promises';
import type { AnalyticsPayload } from '../src/types.ts';

const dataFile = new URL('./data.json', import.meta.url);
const LOADING_DELAY_MS = 3_000;

export type LoadPayload = () => Promise<AnalyticsPayload>;
export type DashboardScenario = 'normal' | 'loading' | 'error' | 'empty';

const loadPayload = async () => JSON.parse(await readFile(dataFile, 'utf8')) as AnalyticsPayload;

const delay = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export const createApp = (
  load: LoadPayload = loadPayload,
  scenario: DashboardScenario = 'normal',
) => {
  const app = express();

  app.get('/api/business-overview', async (_request, response, next) => {
    try {
      if (scenario === 'loading') {
        await delay(LOADING_DELAY_MS);
      }

      if (scenario === 'error') {
        throw new Error('Demo API failure');
      }

      const payload = await load();
      response.json(scenario === 'empty' ? { ...payload, matrix: [] } : payload);
    } catch (error) {
      next(error);
    }
  });

  app.use(
    (
      _error: unknown,
      _request: express.Request,
      response: express.Response,
      _next: express.NextFunction,
    ) => {
      response.status(500).json({ error: 'Unable to load dashboard data' });
    },
  );

  return app;
};
