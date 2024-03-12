import { User } from '@/users/core';

type Users = {
  count: number;
  users: User[];
};

export const fourUsers: Users = {
  count: 4,
  users: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }],
};

export const tenUsers: Users = {
  count: 10,
  users: [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
  ],
};
