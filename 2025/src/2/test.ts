import {
    TEST_INPUT,
    parseInput,
    solvePart1,
    isValid,
    solvePart2,
    isValidV2,
} from "./soln";

describe("solve part 1", () => {
    it("parses input", () => {
        expect(parseInput(TEST_INPUT)).toStrictEqual(
            [
                [11, 22],
                [95, 115],
                [998, 1012],
                [1188511880, 1188511890],
                [222220, 222224],
                [1698522, 1698528],
                [446443, 446449],
                [38593856, 38593862],
                [565653, 565659],
                [824824821, 824824827],
                [2121212118, 2121212124],
            ].sort()
        );
    });

    it("validates an id", () => {
        expect(isValid(55)).toBe(false);
        expect(isValid(123123)).toBe(false);
        expect(isValid(123)).toBe(true);
    });

    it("solves the example", () => {
        expect(solvePart1(TEST_INPUT)).toBe(1227775554);
    });
});

describe("solve part 2", () => {
    it("validates an id", () => {
        // repeats from part 1
        expect(isValidV2(55)).toBe(false);
        expect(isValidV2(123123)).toBe(false);
        expect(isValidV2(123)).toBe(true);

        // new
        expect(isValidV2(111)).toBe(false);
        expect(isValidV2(999)).toBe(false);
        expect(isValidV2(38593859)).toBe(false);
    });
    it("solves the example", () => {
        expect(solvePart2(TEST_INPUT)).toBe(4174379265);
    });
});
