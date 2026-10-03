import express from 'express';
import { readFile } from 'node:fs/promises';

const app = express();
const port = Number(process.env.PORT ?? 3001);
const dataFile = new URL('./data.json', import.meta.url);
const timeSlots = [
  'Feb 2024',
  'Mar 2024',
  'Apr 2024',
  'May 2024',
  'Jun 2024',
  'Jul 2024',
  'Aug 2024',
  'Sep 2024',
  'Oct 2024',
  'Nov 2024',
  'Dec 2024',
  'Jan 2025',
];

app.get('/api/business-overview', async (_request, response, next) => {
  try {
    const data = JSON.parse(await readFile(dataFile, 'utf8'));
    response.json({ timeSlots, root: normalizeNode(data, 'company') });
  } catch (error) {
    next(error);
  }
});

type RawNode = {
  id: string;
  name: string;
  values: number[];
  branches?: RawNode[];
  employees?: RawNode[];
  channels?: RawNode[];
};

type NodeKind = 'company' | 'branch' | 'employee' | 'channel';

type TreeNode = {
  id: string;
  kind: NodeKind;
  name: string;
  values: number[];
  children?: TreeNode[];
};

const normalizeNode = (node: RawNode, kind: NodeKind): TreeNode => {
  const children = [
    ...(node.branches ?? []).map((branch) => normalizeNode(branch, 'branch')),
    ...(node.employees ?? []).map((employee) => normalizeNode(employee, 'employee')),
    ...(node.channels ?? []).map((channel) => normalizeNode(channel, 'channel')),
  ];

  return {
    id: node.id,
    kind,
    name: node.name,
    values: node.values,
    ...(children.length ? { children } : {}),
  };
};

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

app.listen(port, () => {
  console.log(`Book of Business API is running at http://localhost:${port}`);
});
