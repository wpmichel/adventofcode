/**
 * Since the young Elf was just doing silly patterns, you can find the invalid IDs by looking for any ID which is made only of some sequence of digits repeated twice.
 * So, 55 (5 twice), 6464 (64 twice), and 123123 (123 twice) would all be invalid IDs.
 *
 * None of the numbers have leading zeroes; 0101 isn't an ID at all. (101 is a valid ID that you would ignore.)
 *
 * Your job is to find all of the invalid IDs that appear in the given ranges. In the above example:
 *
 * 11-22 has two invalid IDs, 11 and 22.
 * 95-115 has one invalid ID, 99.
 * 998-1012 has one invalid ID, 1010.
 * 1188511880-1188511890 has one invalid ID, 1188511885.
 * 222220-222224 has one invalid ID, 222222.
 * 1698522-1698528 contains no invalid IDs.
 * 446443-446449 has one invalid ID, 446446.
 * 38593856-38593862 has one invalid ID, 38593859.
 * The rest of the ranges contain no invalid IDs.
 * Adding up all the invalid IDs in this example produces 1227775554.
 *
 * What do you get if you add up all of the invalid IDs?
 */

import { readFileSync } from "fs";
import { join } from "path";

// Product ID ranges
export const TEST_INPUT =
    "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124";

export function parseInput(s: string) {
    const ranges = s
        .split(",")
        .map((line) => line.trim())
        .filter(Boolean);
    return ranges
        .map((element) => element.split("-").map((num) => Number(num)))
        .sort();
}

export function isValid(id: number) {
    if (id <= 10) {
        return true;
    }

    const asStr = id.toString();
    if (asStr.length % 2 != 0) {
        // odd length numbers can't have a twice repeated sequence
        return true;
    }
    const half = asStr.length / 2;
    return asStr.slice(0, half) !== asStr.slice(half);
}

export function solvePart1(s: string) {
    /**
     * Looks like it might be possible for ranges to overlap
     * Iterate through ranges, identifying even length numbers (can be split in half).
     * int -> str, cut in half, verify equality.
     *
     * Potentially can scope down. For example, we know if something is 123120 we won't
     * see an invalid id until 3 numbers later, 123120
     */
    const ranges = parseInput(s);
    let invalidIdSum = 0;
    for (const range of ranges) {
        const start = range[0] as number;
        const end = range[1] as number;

        for (let index = start; index <= end; index++) {
            if (!isValid(index)) {
                invalidIdSum += index;
            }
        }
    }
    return invalidIdSum;
}

export function isValidV2(id: number) {
    /**
     * invalid ids will start with some sequence that repeats, at least twice
     * We can build that sequence from 0 to half, checking to see if the next sequence matches
     * If it does, we can proof the rest of the string by first seeing if the length is divisible
     * and then checking remaining segments
     */
    if (id <= 100) {
        return isValid(id);
    }

    const asStr = id.toString();
    let divisor = 2; // Start with 2, because we can see at least twice
    let segmentLength = asStr.length / divisor;
    while (segmentLength >= 1) {
        const firstSegment = asStr.slice(0, segmentLength);
        if (firstSegment.repeat(divisor) === asStr) {
            return false;
        }

        // Reset the loop
        divisor++;
        segmentLength = asStr.length / divisor;
    }

    return true;
}

export function solvePart2(s: string) {
    const ranges = parseInput(s);
    let invalidIdSum = 0;
    for (const range of ranges) {
        const start = range[0] as number;
        const end = range[1] as number;

        for (let index = start; index <= end; index++) {
            if (!isValidV2(index)) {
                invalidIdSum += index;
            }
        }
    }
    return invalidIdSum;
}

if (require.main === module) {
    const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
    console.log(solvePart1(input));
    console.log(solvePart2(input));
}
