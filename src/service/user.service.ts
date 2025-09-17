import { hashPassword, verifyPassword } from '../core/password';
import ServiceError from '../core/serviceError';
import { prisma } from '../data';
import handleDBError from '../data/_handle_DBError';
import type { User, PublicUser, UserCreateInput, UserUpdateInput } from '../types/user';
import Role from '../core/roles';
import { generateJWT, verifyJWT } from '../core/jwt';
import type { SessionInfo } from '../types/auth';
import { getLogger } from '../core/logging';
import jwt from 'jsonwebtoken';

const makeExposedUser = ({id, name, surname, email}: User): PublicUser => ({
  id,
  name,
  surname,
  email,
});

export const checkAndParseSession = async (
  authHeader?: string,
): Promise<SessionInfo> => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);

  try {
    const { roles, sub } = await verifyJWT(authToken);

    return {
      userId: Number(sub),
      roles,
    };
  } catch (error: any) {
    getLogger().error(error.message, { error });

    if (error instanceof jwt.TokenExpiredError) {
      throw ServiceError.unauthorized('The token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw ServiceError.unauthorized(
        `Invalid authentication token: ${error.message}`,
      );
    } else {
      throw ServiceError.unauthorized(error.message);
    }
  }
};

export const checkRole = (role: string, roles: string[]): void => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application',
    );
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) { // DO NOT expose we don't know the user
    throw ServiceError.unauthorized(
      'The given email and password do not match',
    );
  }

  const passwordValid = await verifyPassword(password, user.password_hash);

  if (!passwordValid) { // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized(
      'The given email and password do not match',
    );
  }

  return await generateJWT(user);
};

export const getAll = async (): Promise<PublicUser[]> => {
  const privateUsers =  await prisma.user.findMany();
  return privateUsers.map(makeExposedUser);

};

export const getById = async (id: number): Promise<PublicUser>  => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw ServiceError.notFound(`No user with id ${id} exists`);
  }
  return makeExposedUser(user);
};

export const register = async ({name, surname, email, password}: UserCreateInput): Promise<string> => {
  //return await prisma.user.create({ data: userCreateInput });
  try {
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: {
      name,
      surname,
      email,
      password_hash: passwordHash,
      roles: [Role.USER],
    } });
    return await generateJWT(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (
  id: number,
  userUpdateInput: UserUpdateInput,
): Promise<PublicUser> => {
  try {
    return makeExposedUser(await prisma.user.update({
      where: { id },
      data: userUpdateInput,
    }));
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  try{
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    throw handleDBError(error);
  }
};
