import { RefreshCw } from 'lucide-react';

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div
      className='mx-auto mt-[10vh] max-w-[560px] rounded-xl border-l-4 border-chart-paid bg-surface p-6 shadow-sm'
      data-testid='error-state'
      role='alert'
    >
      <p className='text-sm text-foreground'>{message}</p>
      <button
        className='mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-3 text-sm text-surface transition-colors hover:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground'
        data-testid='error-retry-button'
        onClick={onRetry}
      >
        <RefreshCw aria-hidden='true' size={16} />
        Try again
      </button>
    </div>
  );
};
