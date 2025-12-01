import { readFileSync } from "node:fs";
import { join } from "node:path";

export const TEST_INPUT = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

export const STARTING_POSITION = 50;
export const DIAL_SIZE = 100;

export type Direction = "L" | "R";

export interface Rotations {
    direction: Direction;
    clicks: number;
}

export function rotate(
    startingPosition: number,
    clicks: number,
    direction: Direction
) {
    const normalizedClicks = clicks % DIAL_SIZE;
    const delta = direction === "L" ? -normalizedClicks : normalizedClicks;
    let currentPosition = (startingPosition + delta) % DIAL_SIZE;
    if (currentPosition < 0) {
        currentPosition += DIAL_SIZE;
    }
    return currentPosition;
}

export function parseInput(s: string) {
    return s
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((element) => ({
            direction: element.charAt(0) as Direction,
            clicks: Number.parseInt(element.slice(1), 10),
        }));
}

export function crackLock(rotations: Rotations[]) {
    let zeroCount = 0;
    let currentPosition = STARTING_POSITION;
    rotations.forEach((rotation) => {
        currentPosition = rotate(
            currentPosition,
            rotation.clicks,
            rotation.direction
        );
        if (currentPosition === 0) {
            zeroCount += 1;
        }
    });
    return zeroCount;
}

function main() {
    const FULL_INPUT = readFileSync(join(__dirname, "part1.txt"), "utf-8");
    const rotations = parseInput(FULL_INPUT);
    const zeroCount = crackLock(rotations);
    console.log(`Landed on 0 ${zeroCount} times`);
}

if (require.main === module) {
    main();
}
