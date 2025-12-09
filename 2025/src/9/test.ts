import { TEST_INPUT, parseInput, solvePart1, solvePart2 } from "./soln";

describe("solve part 1", () => {
    it("parses input", () => {
        expect(parseInput(TEST_INPUT)).toStrictEqual([
            { x: 7, y: 1 },
            { x: 11, y: 1 },
            { x: 11, y: 7 },
            { x: 9, y: 7 },
            { x: 9, y: 5 },
            { x: 2, y: 5 },
            { x: 2, y: 3 },
            { x: 7, y: 3 },
        ]);
    });

    it("solves the example", () => {
        expect(solvePart1(TEST_INPUT)).toBe(50);
    });
});

describe("solve part 2", () => {
    it("solves the example", () => {
        expect(solvePart2(TEST_INPUT)).toBe(24);
    });
});
