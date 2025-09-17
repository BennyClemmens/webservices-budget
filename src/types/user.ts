import type { Prisma } from '@prisma/client';
import type { Entity, ListResponse } from './common';

export interface User extends Entity {
  name: string;
  surname: string;
  email: string;
  password_hash: string;
  roles: Prisma.JsonValue;
}

export interface UserCreateInput {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface PublicUser extends Pick<User, 'id' | 'name' | 'surname' | 'email'> {}

export interface UserUpdateInput extends Omit<UserCreateInput, 'password'> {}

//rest
export interface GetUserRequest {
  id: number | 'me';
}

export interface RegisterUserRequest extends UserCreateInput {}
export interface UpdateUserRequest extends Pick<RegisterUserRequest, 'name' | 'surname' | 'email'> {}

export interface GetAllUsersResponse extends ListResponse<PublicUser> {}
export interface GetUserByIdResponse extends PublicUser {}
export interface UpdateUserResponse extends GetUserByIdResponse {}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
