type EmployeeAvatarProps = {
  name: string;
};

const getInitials = (name: string) => {
  const [firstName, lastName] = name.split(' ');

  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

export const EmployeeAvatar = ({ name }: EmployeeAvatarProps) => {
  const initials = getInitials(name);

  return (
    <span
      className='grid size-5 shrink-0 place-items-center rounded-full bg-foreground/8 text-[8px] font-medium text-foreground'
      aria-hidden='true'
      data-testid='employee-avatar'
    >
      {initials}
    </span>
  );
};
