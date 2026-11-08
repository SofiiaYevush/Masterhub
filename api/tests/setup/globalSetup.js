// Vitest `globalSetup`: runs once for the whole run, before any test file or
// worker starts. We boot a single in-memory MongoDB here and share it with
// every test file through MONGO_URI - starting one mongod per file would be
// far slower for no real isolation benefit (each file still gets its own
// database name, see tests/setup/db.js).
import { MongoMemoryServer } from "mongodb-memory-server";

export default async function setup() {
  // Pinned to 6.0.x: Mongoose 6 bundles the MongoDB driver 4.17.x, whose
  // newest fully-supported wire version is server 6.0.
  const mongod = await MongoMemoryServer.create({
    binary: { version: "6.0.14" },
  });

  process.env.MONGO_URI = mongod.getUri();

  return async function teardown() {
    await mongod.stop();
  };
}
