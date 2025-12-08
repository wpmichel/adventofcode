import { TEST_INPUT, parseInput, solvePart1, solvePart2 } from "./soln";

describe("solve part 1", () => {
    it("parses input", () => {
        expect(parseInput(TEST_INPUT)).toStrictEqual({
            ranges: [
                { start: 3, end: 5 },
                { start: 10, end: 14 },
                { start: 12, end: 18 },
                { start: 16, end: 20 },
            ],
            numbers: [1, 5, 8, 11, 17, 32],
        });
    });

    it("solves the example", () => {
        expect(solvePart1(TEST_INPUT)).toBe(3);
    });
});

describe("solve part 2", () => {
    it("solves the example", () => {
        expect(solvePart2(TEST_INPUT)).toBe(14);
    });
});
