import { TEST_INPUT, parseInput, solvePart1, solvePart2 } from "./soln";

describe("solve part 1", () => {
    it("parses input", () => {
        expect(parseInput(TEST_INPUT)).toStrictEqual(TEST_INPUT);
    });

    it("solves the example", () => {
        expect(solvePart1(TEST_INPUT)).toBe(TEST_INPUT);
    });
});

describe("solve part 2", () => {
    it("solves the example", () => {
        expect(solvePart2(TEST_INPUT)).toBe(TEST_INPUT);
    });
});
