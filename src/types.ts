export type TreeNodeKind = 'company' | 'branch' | 'employee' | 'channel';

export type TreeNode = {
  id: string;
  kind?: TreeNodeKind;
  name: string;
  values: number[];
  children?: TreeNode[];
};

export type DashboardData = {
  timeSlots: string[];
  root: TreeNode;
};

export type VisibleTreeRow = {
  node: TreeNode;
  level: number;
  isExpanded: boolean;
};

export type ChartSeries = {
  id: string;
  name: string;
};

export type ChartDatum = {
  timeSlot: string;
  values: Record<string, number>;
};

export type ChartModel = {
  series: ChartSeries[];
  data: ChartDatum[];
};
