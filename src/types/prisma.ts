export type  PrismaModel<T> = {
  createMany(args: { data: T[] }): Promise<{ count: number }>;
  count(): Promise<number>;
};
