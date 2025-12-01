import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
    parseInput,
    DIAL_SIZE,
    STARTING_POSITION,
    Direction,
    Rotations,
    rotate,
} from "./part1";

export function crackLock(rotations: Rotations[]) {
    let passedZeroTimes = 0;
    let currentPosition = STARTING_POSITION;
    rotations.forEach((rotation) => {
        const zeroHits = countZeroHits(
            currentPosition,
            rotation.clicks,
            rotation.direction
        );
        currentPosition = rotate(
            currentPosition,
            rotation.clicks,
            rotation.direction
        );
        passedZeroTimes += zeroHits;
    });
    return passedZeroTimes;
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

export function countZeroHits(
    startingPosition: number,
    clicks: number,
    direction: Direction
) {
    // Didn't move at all
    if (clicks === 0) {
        return 0;
    }

    // move to the right
    if (direction === "R") {
        return Math.floor((startingPosition + clicks) / DIAL_SIZE);
    }

    // Starting from 0, only count the number of full spins
    if (startingPosition === 0) {
        return Math.floor(clicks / DIAL_SIZE);
    }

    // move to the left, never passing 0
    if (clicks < startingPosition) {
        return 0;
    }

    // move to the left, passing 0 and then full rotations
    return 1 + Math.floor((clicks - startingPosition) / DIAL_SIZE);
}
