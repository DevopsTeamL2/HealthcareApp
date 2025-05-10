import { strict as assert } from "assert";

describe("Sample Test Suite", () => {
  it("should return true for 1 + 1 === 2", () => {
    assert.strictEqual(1 + 1, 2);
  });

  it("should return false for 1 + 1 === 3", () => {
    assert.notStrictEqual(1 + 1, 3);
  });
});