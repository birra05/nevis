import { createApp, type DashboardScenario } from './app.ts';

const DEFAULT_PORT = 3001;
const port = Number(process.env.PORT ?? DEFAULT_PORT);

const getDashboardScenario = (): DashboardScenario => {
  if (process.env.NODE_ENV !== 'development') {
    return 'normal';
  }

  if (process.env.DASHBOARD_SCENARIO === 'loading') {
    return 'loading';
  }

  if (process.env.DASHBOARD_SCENARIO === 'error') {
    return 'error';
  }

  if (process.env.DASHBOARD_SCENARIO === 'empty') {
    return 'empty';
  }

  return 'normal';
};

createApp(undefined, getDashboardScenario()).listen(port, () => {
  console.log(`Book of Business API is running at http://localhost:${port}`);
});
