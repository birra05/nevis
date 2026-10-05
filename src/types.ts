export interface BaseNode {
  id: string;
  name: string;
}

export interface CompanyNode extends BaseNode {
  nodeType: 'company';
  children: BranchNode[];
}

export interface BranchNode extends BaseNode {
  nodeType: 'branch';
  children: EmployeeNode[];
}

export interface EmployeeNode extends BaseNode {
  nodeType: 'employee';
  avatarUrl: string | null;
  children: ChannelNode[];
}

export interface ChannelNode extends BaseNode {
  nodeType: 'channel';
}

export type TreeNode = CompanyNode | BranchNode | EmployeeNode | ChannelNode;

export type ParentNode = CompanyNode | BranchNode | EmployeeNode;

export interface PeriodMatrixRow {
  date: string;
  values: Record<string, number>;
}

export interface AnalyticsPayload {
  tree: CompanyNode;
  matrix: PeriodMatrixRow[];
}

export const isParentNode = (node: TreeNode): node is ParentNode => node.nodeType !== 'channel';

export type Period = {
  date: string;
  label: string;
};

export type AnalyticsView = {
  payload: AnalyticsPayload;
  periods: readonly Period[];
  valuesByNodeId: ReadonlyMap<string, readonly number[]>;
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
  period: string;
  values: Record<string, number>;
};

export type ChartModel = {
  series: ChartSeries[];
  data: ChartDatum[];
};
