import { TEST_INPUT, parseInput, solvePart1, solvePart2 } from "./soln";

describe("solve part 1", () => {
    it("parses input", () => {
        expect(parseInput(TEST_INPUT)).toStrictEqual({
            numbers: [
                [123, 328, 51, 64],
                [45, 64, 387, 23],
                [6, 98, 215, 314],
            ],
            operators: ["*", "+", "*", "+"],
        });
    });

    it("solves the example", () => {
        expect(solvePart1(TEST_INPUT)).toBe(4277556);
    });
});

describe("solve part 2", () => {
    it("solves the example", () => {
        expect(solvePart2(TEST_INPUT)).toBe(3263827);
    });
});
