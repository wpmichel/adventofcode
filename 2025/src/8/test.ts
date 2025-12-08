import { TEST_INPUT, parseInput, solvePart1, solvePart2 } from "./soln";

describe("solve part 1", () => {
    it("parses input", () => {
        expect(parseInput(TEST_INPUT).slice(0, 2)).toStrictEqual([
            { x: 162, y: 817, z: 812 },
            { x: 57, y: 618, z: 57 },
        ]);
    });

    it("solves the example", () => {
        expect(solvePart1(TEST_INPUT)).toBe(40);
    });
});

describe("solve part 2", () => {
    it("solves the example", () => {
        expect(solvePart2(TEST_INPUT)).toBe(25272);
    });
});
