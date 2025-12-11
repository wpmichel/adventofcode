import {
    TEST_INPUT,
    parseInput,
    solvePart1,
    solvePart2,
    SOURCE,
    TEST_INPUT_PART2,
} from "./soln";

describe("solve part 1", () => {
    it("parses input", () => {
        expect(parseInput(TEST_INPUT).get(SOURCE)).toStrictEqual([
            "bbb",
            "ccc",
        ]);
    });

    it("solves the example", () => {
        expect(solvePart1(TEST_INPUT)).toBe(5);
    });
});

describe("solve part 2", () => {
    it("solves the example", () => {
        expect(solvePart2(TEST_INPUT_PART2)).toBe(2);
    });
});
