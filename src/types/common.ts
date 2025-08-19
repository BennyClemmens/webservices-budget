export interface Entity {
  id: number;
}

// generic type for all getAll responses
export interface ListResponse<T> {
  items: T[];
}

export interface IdParams {
  id: number;
}
