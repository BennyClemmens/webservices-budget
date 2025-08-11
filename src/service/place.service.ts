import { PLACES } from '../data/mock_data';

export const getAll = () => {
  return PLACES;
};

export const getById = (id: number) => {
  const existingPlace = PLACES.find((p) => p.id === id);
  if (! existingPlace)
    throw new Error(`There is no place with id ${id}`);
  return existingPlace;
};

export const create = ({ name, rating }: any) => {
  const maxId = Math.max(...PLACES.map((i) => i.id));
  const newPlace = { // objec literal !
    id: maxId + 1,
    name,
    rating,
  };
  PLACES.push(newPlace);
  return newPlace;
};

export const updateById = (
  id: number,
  { name, rating }: any,
) => {

  const index = PLACES.findIndex((p) => p.id === id);
  if (index === -1)
    throw new Error(`There is no place with id ${id}`);

  //const currentPlace= PLACES[index];
  //console.log(currentPlace);

  const updatedPlace = {
    ...PLACES[index],
    id,
    name,
    rating,
  };
  PLACES[index] = updatedPlace;
  return updatedPlace;
};

export const deleteById = (id: number) => {
  const index = PLACES.findIndex((p) => p.id === id);
  if (index === -1)
    throw new Error(`There is no place with id ${id}`);
  const deleted = PLACES.splice(index, 1);
  if (! deleted)
    throw new Error(`Could not delete record with index ${index}`);
  console.log(JSON.stringify(deleted));
};
