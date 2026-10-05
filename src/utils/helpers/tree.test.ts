import { describe, expect, it } from 'vitest';
import type { CompanyNode } from '../../types.ts';
import { findNode } from './tree.ts';

describe('findNode', () => {
  it('finds a nested strict-tree node', () => {
    const root: CompanyNode = {
      id: 'company',
      name: 'Company',
      nodeType: 'company',
      children: [
        {
          id: 'branch',
          name: 'Branch',
          nodeType: 'branch',
          children: [
            {
              id: 'employee',
              name: 'Employee',
              nodeType: 'employee',
              avatarUrl: null,
              children: [{ id: 'channel', name: 'Channel', nodeType: 'channel' }],
            },
          ],
        },
      ],
    };

    expect(findNode(root, 'channel')?.name).toBe('Channel');
    expect(findNode(root, 'missing')).toBeUndefined();
  });
});
