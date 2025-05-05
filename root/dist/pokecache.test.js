import { Cache } from "./pokecache.js";
import { test, expect } from "vitest";
test.concurrent.each([
    {
        key: "https://example.com",
        val: "testdata",
        interval: 500, // 0.5 seconds
    },
    {
        key: "https://example.com/path",
        val: "moretestdata",
        interval: 1000, // 1 second
    },
])("Test Caching $interval ms", async ({ key, val, interval }) => {
    const cache = new Cache(interval);
    cache.add(key, val);
    const cached = cache.get(key);
    expect(cached).toBe(val);
    await new Promise((resolve) => setTimeout(resolve, interval + 100));
    const reaped = cache.get(key);
    expect(reaped).toBe(undefined);
    cache.stopReapLoop();
});
// import { Cache } from "./pokecache.js";
// import { test, expect } from "vitest";
// test.concurrent.each([
//   {
//     key: "https://example.com",
//     val: "testdata",
//     interval: 500, // 0.5 seconds
//   },
//   {
//     key: "https://example.com/path",
//     val: "moretestdata",
//     interval: 1000, // 1 second
//   },
// ])("Test Caching $interval ms", async ({ key, val, interval }) => {
//   const cache = new Cache(interval);
//   cache.add(key, val);
//   const cached = cache.get(key);
//   expect(cached).toBe(val);
//   await new Promise((resolve) => setTimeout(resolve, interval + 50)); // Reduced wait time
//   const reaped = cache.get(key);
//   expect(reaped).toBe(undefined);
//   cache.stopReapLoop();
// });
