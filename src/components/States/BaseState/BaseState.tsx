import type { FC, ReactNode } from 'react';

type BaseStateProps = {
  action?: ReactNode;
  containerClassName?: string;
  description: string;
  icon: ReactNode;
  role?: 'alert' | 'status';
  testId?: string;
  title: string;
};

export const BaseState: FC<BaseStateProps> = ({
  action,
  containerClassName,
  description,
  icon,
  role,
  testId,
  title,
}) => {
  return (
    <section
      className={`mx-auto mt-[10vh] max-w-[560px] rounded-xl bg-surface p-6 text-center shadow-sm ${containerClassName ?? ''}`}
      data-testid={testId}
      role={role}
    >
      {icon}
      <h1 className='mt-3 text-lg font-medium text-foreground'>{title}</h1>
      <p className='mt-2 text-sm text-foreground-muted'>{description}</p>
      {action}
    </section>
  );
};
