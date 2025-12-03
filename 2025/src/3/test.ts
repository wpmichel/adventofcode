import {
    TEST_INPUT,
    parseInput,
    solvePart1,
    solvePart2,
    findLargestJoltage,
    findLargestJoltageWithTwelveBatteries,
} from "./soln";

function stringToNumberArray(s: string): number[] {
    return Array.from(s).map((char) => Number.parseInt(char, 10));
}

describe("solve part 1", () => {
    it("parses input", () => {
        expect(parseInput(TEST_INPUT)).toStrictEqual([
            stringToNumberArray("987654321111111"),
            stringToNumberArray("811111111111119"),
            stringToNumberArray("234234234234278"),
            stringToNumberArray("818181911112111"),
        ]);
    });

    it("finds largest joltage", () => {
        expect(findLargestJoltage(stringToNumberArray("987654321111111"))).toBe(
            98
        );
        expect(findLargestJoltage(stringToNumberArray("811111111111119"))).toBe(
            89
        );
        expect(findLargestJoltage(stringToNumberArray("234234234234278"))).toBe(
            78
        );
        expect(findLargestJoltage(stringToNumberArray("818181911112111"))).toBe(
            92
        );
    });

    it("solves the example", () => {
        expect(solvePart1(TEST_INPUT)).toBe(357);
    });
});

describe("solve part 2", () => {
    it("finds largest joltage", () => {
        expect(
            findLargestJoltageWithTwelveBatteries(
                stringToNumberArray("987654321111111")
            )
        ).toBe(987654321111);
        expect(
            findLargestJoltageWithTwelveBatteries(
                stringToNumberArray("811111111111119")
            )
        ).toBe(811111111119);
        expect(
            findLargestJoltageWithTwelveBatteries(
                stringToNumberArray("234234234234278")
            )
        ).toBe(434234234278);
        expect(
            findLargestJoltageWithTwelveBatteries(
                stringToNumberArray("818181911112111")
            )
        ).toBe(888911112111);
    });

    it("solves the example", () => {
        expect(solvePart2(TEST_INPUT)).toBe(3121910778619);
    });
});
