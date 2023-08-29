import { users } from "@prisma/client";

class User {
  private _records: users[] = [];

  public async findUnique(options): Promise<users | null> {
    return (
      this._records.find((record) => record.id === options.where.id) ?? null
    );
  }

  public async upsert(options) {
    const exists = await this.findUnique({ where: { id: options.where.id } });
    if (exists) {
      for (const key of Object.keys(options.update)) {
        exists[key] = options.update[key];
      }
    } else {
      this._records.push(options.create);
    }
    return this.findUnique({ where: { id: options.where.id } });
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
