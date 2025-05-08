import { cleanInput } from "./repl";
import { describe, expect, test } from "vitest";

describe.each([
  {
    input: "  hello  world  ",
    expected: ["hello", "world"],
  },
  {
    input: "   singleWord   ",
    expected: ["singleword"],
  },
  {
    input: "  multiple   spaces   between words  ",
    expected: ["multiple", "spaces", "between", "words"],
  },
  {
    input: "",
    expected: [],
  },
  {
    input: "   ",
    expected: [],
  },
])("cleanInput($input)", ({ input, expected }) => {
  test(`Expected: ${expected}`, () => {
    const actual = cleanInput(input);

    // Check the length of the result
    expect(actual).toHaveLength(expected.length);

    // Check each word in the result
    for (const i in expected) {
      expect(actual[i]).toBe(expected[i]);
    }
  });
});



// import { cleanInput } from "./repl";
// import { describe, expect, test } from "vitest";

// describe.each([
//     {
//       input: "  ",
//       expected: [],
//     },
//     {
//       input: "  hello  ",
//       expected: ["hello"],
//     },
//     {
//       input: "  hello  world  ",
//       expected: ["hello", "world"],
//     },
//     {
//       input: "  HellO  World  ",
//       expected: ["hello", "world"],
//     },
//   ])("cleanInput($input)", ({ input, expected }) => {
//     test(`Expected: ${expected}`, () => {
//       const actual = cleanInput(input);
//       expect(actual).toHaveLength(expected.length);
//       for (const i in expected) {
//         expect(actual[i]).toBe(expected[i]);
//       }
//     });
//   });
  