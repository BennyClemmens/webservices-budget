import { USERS } from '../data/mock_data';

export const getAll = () => {
  return USERS;
};

export const getById = (id: number) => {
  const existingUser = USERS.find((u) => u.id === id);
  if (! existingUser)
    throw new Error(`There is no user with id ${id}`);
  return existingUser;
};

export const create = ({ name, surname }: any) => {
  const maxId = Math.max(...USERS.map((i) => i.id));
  const newUser = { // objec literal !
    id: maxId + 1,
    name,
    surname,
  };
  USERS.push(newUser);
  return newUser;
};

export const updateById = (
  id: number,
  { name, surname }: any,
) => {

  const index = USERS.findIndex((u) => u.id === id);
  if (index === -1)
    throw new Error(`There is no user with id ${id}`);

  //const currentUser= UESERS[index];
  //console.log(currentUser);

  const updatedUser = {
    ...USERS[index],
    id,
    name,
    surname,
  };
  USERS[index] = updatedUser;
  return updatedUser;
};

export const deleteById = (id: number) => {
  const index = USERS.findIndex((p) => p.id === id);
  if (index === -1)
    throw new Error(`There is no user with id ${id}`);
  const deleted = USERS.splice(index, 1);
  if (! deleted)
    throw new Error(`Could not delete record with index ${index}`);
  console.log(JSON.stringify(deleted));
};
