import { rest } from 'msw';
import { environment } from 'src/environment/environment';

export const appendPath = (path: string) => `${environment.backEnd}${path}`;

type ID = number;

/**
 * Provides a simple CRUD interface for a collection of objects
 * @param initialValues - initial values for the collection
 */
export class Collection<TValue extends { id: ID }> {
  data: TValue[] = [];
  constructor(initialValues: TValue[] = []) {
    this.data = [...initialValues];
  }

  remove = (id: ID) => (this.data = this.data.filter((x) => x.id !== id));

  find = (id: ID) => this.data.find((x) => x.id === id);

  update = (id: ID, newData: TValue) => {
    const index = this.data.findIndex((x) => x.id === id);
    this.data[index] = newData;
  };

  add = (newData: TValue) => {
    this.data = [...this.data, { ...newData, id: this.nextId() }];
  };

  private nextId = () => this.data.sort((a, b) => a.id - b.id)[this.data.length - 1].id + 1;
}

/**
 *  Creates the handlers for Mock Service Worker to handle basic CRUD operations
 * @param path - the path to the resource
 * @param collection - the collection of data to be used
 * @returns an object with the handlers for the CRUD operations and a method to group the handlers in an array
 */
export const createMSWHandlers = <TValue extends { id: ID }>(
  path: string,
  collection: Collection<TValue>
) => {
  const getAll = rest.get(appendPath(`${path}`), (req, res, ctx) =>
    res(ctx.json(collection.data), ctx.delay(1000))
  );
  const find = rest.get(appendPath(`${path}/:id`), (req, res, ctx) =>
    res(ctx.json(collection.find(Number(req.params.id))), ctx.delay(1000))
  );

  const remove = rest.delete(appendPath(`${path}/:id`), (req, res, ctx) => {
    collection.remove(Number(req.params.id));
    return res(ctx.delay(1000));
  });

  const update = rest.put(appendPath(`${path}/:id`), async (req, res, ctx) => {
    const body = await req.json();
    const { id } = req.params;
    collection.update(Number(id), body);
    return res(ctx.json(body), ctx.delay(1000));
  });

  const create = rest.post(appendPath(`${path}`), async (req, res, ctx) => {
    const body = await req.json();
    collection.add(body);
    return res(ctx.delay(1000), ctx.json({}));
  });

  return {
    getAll,
    find,
    remove,
    update,
    create,
    toArray: () => [getAll, find, remove, update, create],
  };
};
