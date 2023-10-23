import { users } from "@prisma/client";

class User {
  private _records: users[] = [];

  public async findUnique(options): Promise<users | null> {
    return (
      this._records.find((record) => record.userId === options.where.userId) ??
      null
    );
  }

  public async findMany(): Promise<users[]> {
    return this._records;
  }

  public async delete(options) {
    const index = this._records.findIndex(
      (record) => record.userId === options.where.userId
    );
    if (index === -1) {
      throw new Error("User not found");
    }
    this._records.splice(index, 1);
  }

  public async upsert(options) {
    const exists = await this.findUnique({
      where: { userId: options.where.userId }
    });
    if (exists) {
      for (const key of Object.keys(options.update)) {
        exists[key] = options.update[key];
      }
      return exists;
    }
    this._records.push(options.create);
    return this.findUnique({ where: { userId: options.where.userId } });
  }

  public async update(options) {
    const exists = await this.findUnique({
      where: { userId: options.where.userId }
    });
    if (!exists) {
      throw new Error("User not found");
    }
    for (const key of Object.keys(options.data)) {
      exists[key] = options.data[key];
    }
  }
}

/**
 * Mock database.
 *
 * @class
 */
export class Database {
  private _user: User;

  /**
   * Constructor.
   */
  constructor() {
    this._user = new User();
  }

  /**
   * Handles the user property.
   *
   * @type {User}
   * @public
   */
  public get users(): User {
    return this._user;
  }
}
