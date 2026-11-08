// Per-test-file database isolation on top of the single shared mongod from
// globalSetup.js. Each test file gets its own randomly-named database on the
// same server, so files can run in parallel without clobbering each other's
// data, while still reusing one mongod process for speed.
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { beforeAll, afterAll, afterEach } from "vitest";

export function useDatabase() {
  beforeAll(async () => {
    const baseUri = process.env.MONGO_URI.replace(/\/$/, "");
    const dbName = `test_${randomUUID().replace(/-/g, "")}`;
    await mongoose.connect(`${baseUri}/${dbName}`);
  }, 30000);

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    await Promise.all(
      Object.values(collections).map((collection) => collection.deleteMany({}))
    );
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
}
