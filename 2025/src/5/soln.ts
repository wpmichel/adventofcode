import { join } from "path";
import { readFileSync } from "fs";

export const TEST_INPUT = `
3-5
10-14
16-20
12-18

1
5
8
11
17
32`;

export function parseInput(s: string): {
    ranges: { start: number; end: number }[];
    numbers: number[];
} {
    const [rangesPart, numbersPart] = s.trim().split("\n\n");
    const ranges = rangesPart!
        .split("\n")
        .map((line) => {
            const [start, end] = line.split("-").map(Number);
            return { start: start!, end: end! };
        })
        .sort((a, b) => a.start - b.start);
    const numbers = numbersPart!.split("\n").map(Number);
    return { ranges, numbers };
}

export function solvePart1(s: string) {
    const { ranges, numbers } = parseInput(s);
    let spoiledCount = 0;
    for (const num of numbers) {
        for (const { start, end } of ranges) {
            if (num >= start && num <= end) {
                spoiledCount++;
                break;
            }
        }
    }
    return spoiledCount;
}

export function solvePart2(s: string) {
    const { ranges } = parseInput(s);
    // Merge overlapping ranges

    const mergedRanges: { start: number; end: number }[] = [];
    for (const [idx, range] of ranges.entries()) {
        if (idx === 0) {
            mergedRanges.push(range);
            continue;
        }
        const lastMerged = mergedRanges[mergedRanges.length - 1]!;
        if (range.start <= lastMerged.end) {
            // Overlap
            lastMerged.end = Math.max(lastMerged.end, range.end);
        } else {
            mergedRanges.push(range);
        }
    }

    let freshIdsCount = 0;
    mergedRanges.forEach(({ start, end }) => {
        freshIdsCount += end - start + 1;
    });
    return freshIdsCount;
}

if (require.main === module) {
    const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
    console.log(solvePart1(input));
    console.log(solvePart2(input));
}
