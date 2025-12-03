import { join } from "path";
import { readFileSync } from "fs";

export const TEST_INPUT = "";

export function parseInput(s: string) {
    return s;
}

export function solvePart1(s: string) {
    return s;
}

export function solvePart2(s: string) {
    return s;
}

if (require.main === module) {
    const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
    console.log(solvePart1(input));
    console.log(solvePart2(input));
}
