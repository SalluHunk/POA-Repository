/**
 * DGP-DEV-009: minimal ambient typing for Node's built-in `node:sqlite`
 * module (stable in the Node version this proving slice runs on). The
 * project's pinned `@types/node@^20` predates this module's typings;
 * rather than bump a shared devDependency for one experimental slice,
 * this declares only the surface actually used here. Not a claim that
 * this is the complete `node:sqlite` API.
 */
declare module "node:sqlite" {
  export interface StatementResultingChanges {
    changes: number | bigint;
    lastInsertRowid: number | bigint;
  }

  export class StatementSync {
    run(...params: unknown[]): StatementResultingChanges;
    get(...params: unknown[]): Record<string, unknown> | undefined;
    all(...params: unknown[]): Record<string, unknown>[];
  }

  export interface DatabaseSyncOptions {
    open?: boolean;
  }

  export class DatabaseSync {
    constructor(location: string, options?: DatabaseSyncOptions);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
