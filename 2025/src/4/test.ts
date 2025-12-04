import { TEST_INPUT, parseInput, solvePart1, solvePart2 } from "./soln";

describe("solve part 1", () => {
    it("parses input", () => {
        expect(parseInput(TEST_INPUT)).toStrictEqual([
            Array.from("..@@.@@@@."),
            Array.from("@@@.@.@.@@"),
            Array.from("@@@@@.@.@@"),
            Array.from("@.@@@@..@."),
            Array.from("@@.@@@@.@@"),
            Array.from(".@@@@@@@.@"),
            Array.from(".@.@.@.@@@"),
            Array.from("@.@@@.@@@@"),
            Array.from(".@@@@@@@@."),
            Array.from("@.@.@@@.@."),
        ]);
    });

    it("solves the example", () => {
        expect(solvePart1(TEST_INPUT)).toBe(13);
    });
});

describe("solve part 2", () => {
    it("solves the example", () => {
        expect(solvePart2(TEST_INPUT)).toBe(43);
    });
});
