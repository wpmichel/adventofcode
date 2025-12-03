import { join } from "path";
import { readFileSync } from "fs";
import { DynamicValueItem, dynamicValueKnapsack } from "../common/knapsack";

export const TEST_INPUT = `
987654321111111
811111111111119
234234234234278
818181911112111`;

export function parseInput(s: string) {
    return s
        .trim()
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) =>
            Array.from(line).map((char) => Number.parseInt(char, 10))
        );
}

export function findLargestJoltage(bank: number[]) {
    if (bank.length === 0) {
        throw new Error("Bank is empty");
    }

    // From right to left, keep track of the largest voltages seen
    const largestVolatageAt: number[] = new Array(bank.length);
    largestVolatageAt[bank.length - 1] = bank[bank.length - 1]!;

    for (let i = bank.length - 2; i >= 0; i--) {
        largestVolatageAt[i] = Math.max(bank[i]!, largestVolatageAt[i + 1]!);
    }

    // best we can do for i is to take bank[i] and largestVolatageAt[i+1]
    let best = -1;
    for (let i = 0; i < bank.length - 1; i++) {
        let choice = bank[i]! * 10 + largestVolatageAt[i + 1]!;
        best = Math.max(best, choice);
    }
    if (best === -1) {
        throw new Error("No valid joltage found");
    }
    return best;
}

export function findLargestJoltageWithTwelveBatteries(bank: number[]) {
    if (bank.length < 12) {
        throw new Error("Bank has fewer than 12 batteries");
    }

    if (bank.length === 12) {
        return bank.reduce((acc, val) => acc * 10 + val, 0);
    }

    /**
     * We can pick any 12 batteries from the bank but still in order
     * Feels like knapsack - at each battery we can choose to take it or leave it, until we have 12
     * We want to modify it such that
     * weight = 1 (we can only take 1 battery at a time)
     * value = battery voltage * 10^(12 - number of batteries taken so far - 1)
     */
    const items = bank.map<DynamicValueItem>((voltage) => ({
        weight: 1,
        valueFn: (_dp, _choice, _weight) => {
            const takenSoFar = _weight;
            const power = 12 - takenSoFar;
            return voltage * 10 ** power;
        },
    }));

    const result = dynamicValueKnapsack(items, 12);

    return result.maxValue;
}

export function solvePart1(s: string) {
    const banks = parseInput(s);
    let total = 0;
    for (const bank of banks) {
        total += findLargestJoltage(bank);
    }
    return total;
}

export function solvePart2(s: string) {
    const banks = parseInput(s);
    let total = 0;
    for (const bank of banks) {
        total += findLargestJoltageWithTwelveBatteries(bank);
    }
    return total;
}

if (require.main === module) {
    const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
    console.log(solvePart1(input));
    console.log(solvePart2(input));
}
