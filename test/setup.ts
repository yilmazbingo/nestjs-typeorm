import { rm } from 'fs/promises';
import { join } from 'path';
//if we had multiple test cased in auth.e2e-spec.ts, I would get error because one case will delete but for the second test, type orm actively will try to maintain the database.
import { getConnection } from 'typeorm';
global.beforeEach(async () => {
  // if file does not exist, rm will throw an error. maybe first time we run that file does not exist
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (e) {
    // if error is thrown i dont need to do anything
  }
});

global.afterEach(async () => {
  const connection = await getConnection();
  await connection.close();
});
