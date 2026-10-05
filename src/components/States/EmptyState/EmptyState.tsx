import { Inbox } from 'lucide-react';
import type { FC } from 'react';
import { BaseState } from '../BaseState';

export const EmptyState: FC = () => {
  return (
    <BaseState
      containerClassName='border border-border-subtle'
      description='There are no reporting periods available'
      icon={<Inbox className='mx-auto text-foreground-muted' aria-hidden='true' size={24} />}
      role='status'
      testId='empty-state'
      title='No client values yet'
    />
  );
};
