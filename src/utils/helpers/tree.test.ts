import { describe, expect, it } from 'vitest';
import type { TreeNode } from '../../types.js';
import { findNode } from './tree.js';

describe('findNode', () => {
  it('finds a nested node', () => {
    const root: TreeNode = {
      id: 'company',
      name: 'Company',
      values: [],
      children: [
        {
          id: 'branch',
          name: 'Branch',
          values: [],
          children: [{ id: 'employee', name: 'Employee', values: [] }],
        },
      ],
    };

    expect(findNode(root, 'employee')?.name).toBe('Employee');
    expect(findNode(root, 'missing')).toBeUndefined();
  });
});
