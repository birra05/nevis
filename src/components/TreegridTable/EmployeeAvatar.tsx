import { useState, type FC } from 'react';

type EmployeeAvatarProps = {
  name: string;
  avatarUrl: string | null;
};

const getInitials = (name: string) => {
  const [firstName, lastName] = name.split(' ');

  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

export const EmployeeAvatar: FC<EmployeeAvatarProps> = ({ name, avatarUrl }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const initials = getInitials(name);

  const onImageError = () => {
    setImageFailed(true);
  };

  if (avatarUrl && !imageFailed) {
    return (
      <img
        className='size-5 shrink-0 rounded-full object-cover'
        src={avatarUrl}
        alt=''
        data-testid='employee-avatar-image'
        onError={onImageError}
      />
    );
  }

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
