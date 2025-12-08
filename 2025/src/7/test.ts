import { TEST_INPUT, solvePart1, solvePart2 } from "./soln";

describe("solve part 1", () => {
    it("solves the example", () => {
        expect(solvePart1(TEST_INPUT)).toBe(21);
    });
});

describe("solve part 2", () => {
    it("solves the example", () => {
        expect(solvePart2(TEST_INPUT)).toBe(40);
    });
});
