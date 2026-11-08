import { describe, it, expect } from "vitest";
import createError from "../../../utils/createError.js";

describe("createError", () => {
  it("builds an Error with the given status and message", () => {
    const err = createError(404, "Not found");

    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(404);
    expect(err.message).toBe("Not found");
  });

  it("supports any status/message combination", () => {
    const err = createError(403, "Forbidden");

    expect(err.status).toBe(403);
    expect(err.message).toBe("Forbidden");
  });
});
