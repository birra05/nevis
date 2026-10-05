import { CircleAlert, RefreshCw } from 'lucide-react';
import type { FC } from 'react';
import { BaseState } from '../BaseState';

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export const ErrorState: FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <BaseState
      action={
        <button
          className='mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-3 text-sm text-surface transition-colors hover:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground'
          data-testid='error-retry-button'
          onClick={onRetry}
        >
          <RefreshCw aria-hidden='true' size={16} />
          Try again
        </button>
      }
      containerClassName='border-l-4 border-error-accent'
      description={message}
      icon={<CircleAlert className='mx-auto text-error-accent' aria-hidden='true' size={24} />}
      role='alert'
      testId='error-state'
      title='Unable to load client values'
    />
  );
};
