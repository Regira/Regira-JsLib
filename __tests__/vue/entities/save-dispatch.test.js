import { describe, test, expect } from "vitest";
import { EntityServiceBase, isNewEntity } from "../../../src/vue/entities/abstractions";

describe("isNewEntity", () => {
  test.each([
    [null, true],
    [undefined, true],
    ["new", true],
    ["", true],
    [0, true],
    [-1, true], // negative temp id minted for a new owned/related-collection row
    [-42, true],
    [5, false],
    [1, false],
    ["42", false],
    ["a1b2c3", false],
  ])("isNewEntity(%p) === %p", (id, expected) => {
    expect(isNewEntity(id)).toBe(expected);
  });
});

// A model that returns a bare numeric key from $id (id = 0 for a fresh instance).
// Before the fix this pattern silently issued PUT /0 instead of POST on create.
class Model {
  constructor(id = 0) {
    this.id = id;
    this.name = "x";
  }
  get $id() {
    return this.id;
  }
  get $title() {
    return this.name;
  }
}

class TestService extends EntityServiceBase {
  toEntity(item) {
    return Object.assign(new Model(), item);
  }
}

function makeService() {
  const calls = [];
  const axios = {
    post: async (url, body) => (calls.push({ method: "POST", url }), { data: { item: body } }),
    put: async (url, body) => (calls.push({ method: "PUT", url }), { data: { item: body } }),
    get: async () => ({ data: { item: null } }),
    delete: async () => ({ data: {} }),
  };
  const service = new TestService(axios, { key: "test", api: "/api/models" });
  return { service, calls };
}

describe("EntityServiceBase.save dispatch", () => {
  test("inserts a fresh model whose $id is a bare 0 (POST, no id in URL)", async () => {
    const { service, calls } = makeService();
    const { isNew } = await service.save(new Model(0));
    expect(isNew).toBe(true);
    expect(calls).toEqual([{ method: "POST", url: "/api/models" }]);
  });

  test("inserts a new related-collection row carrying a negative temp id (POST)", async () => {
    const { service, calls } = makeService();
    const { isNew } = await service.save(new Model(-1));
    expect(isNew).toBe(true);
    expect(calls).toEqual([{ method: "POST", url: "/api/models" }]);
  });

  test("updates an existing model (PUT with id in URL)", async () => {
    const { service, calls } = makeService();
    const { isNew } = await service.save(new Model(5));
    expect(isNew).toBe(false);
    expect(calls).toEqual([{ method: "PUT", url: "/api/models/5" }]);
  });
});
