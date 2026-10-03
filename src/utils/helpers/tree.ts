import type { DashboardData, TreeNode, VisibleTreeRow } from '../../types.js';

export const findNode = (node: TreeNode, id: string): TreeNode | undefined => {
  if (node.id === id) {
    return node;
  }

  for (const child of node.children ?? []) {
    const match = findNode(child, id);

    if (match) {
      return match;
    }
  }
};

/** Returns only rows whose ancestors are expanded; the root is always visible. */
export const flattenVisibleRows = (
  root: TreeNode,
  expandedIds: ReadonlySet<string>,
): VisibleTreeRow[] => {
  const rows: VisibleTreeRow[] = [];

  const visit = (node: TreeNode, level: number) => {
    const isExpanded = expandedIds.has(node.id);
    rows.push({ node, level, isExpanded });

    if (isExpanded) {
      node.children?.forEach((child) => visit(child, level + 1));
    }
  };

  visit(root, 1);
  return rows;
};

export const validateData = (book: DashboardData): string | undefined => {
  const visit = (node: TreeNode): string | undefined => {
    if (node.values.length !== book.timeSlots.length) {
      return `Values for "${node.name}" do not match the number of time slots.`;
    }

    return node.children?.map(visit).find((error) => error !== undefined);
  };

  return visit(book.root);
};
