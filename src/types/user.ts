import type { Entity } from './common';

export interface User extends Entity {
  name: string;
  surname: string;
}

export interface UserCreateInput {
  name: string;
  surname: string;
}

export interface UserUpdateInput extends UserCreateInput {}
