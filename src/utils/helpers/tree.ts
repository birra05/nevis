import { isParentNode, type TreeNode, type VisibleTreeRow } from '../../types.ts';

export const findNode = (node: TreeNode, id: string): TreeNode | undefined => {
  if (node.id === id) {
    return node;
  }

  for (const child of isParentNode(node) ? node.children : []) {
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

    if (isExpanded && isParentNode(node)) {
      node.children.forEach((child) => visit(child, level + 1));
    }
  };

  visit(root, 1);
  return rows;
};
