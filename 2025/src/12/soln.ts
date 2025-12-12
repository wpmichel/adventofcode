import { join } from "path";
import { readFileSync } from "fs";
import { backtrack } from "../common/backtrack";

export const TEST_INPUT = `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`;

export interface Region {
    grid: number[][];
    dimensions: { width: number; height: number };
    presents: number[];
}

export function parseInput(s: string) {
    const regions: Region[] = [];
    const presentSpecs: number[][][] = [];
    const chunks = s.split("\n\n");

    // last chunk is the region dimensions
    const dimensionChunk = chunks[chunks.length - 1]!;

    // build present specs
    chunks.splice(0, chunks.length - 1).forEach((chunk) => {
        const grid: number[][] = [];
        chunk
            .split(":")[1]!
            .trim()
            .split("\n")
            .forEach((line) => {
                grid.push(
                    line
                        .trim()
                        .split("")
                        .map((char) => (char === "#" ? 1 : 0))
                );
            });
        presentSpecs.push(grid);
    });

    dimensionChunk.split("\n").forEach((line) => {
        const [dimPart, presentPart] = line
            .split(":")
            .map((part) => part.trim());
        const [width, height] = dimPart!.split("x").map(Number);
        const presentList = presentPart!.split(" ").map(Number);
        regions.push({
            grid: Array.from({ length: height! }, () => Array(width!).fill(0)),
            dimensions: { width: width!, height: height! },
            presents: presentList,
        });
    });
    return { regions, presentSpecs };
}

function copy2d(array: number[][]) {
    return array.map((row) => [...row]);
}

function rotate90Degrees(present: number[][]) {
    const copy = copy2d(present);

    // transpose
    for (let i = 0; i < copy.length; i++) {
        for (let j = i; j < copy[0]!.length; j++) {
            const temp = copy[i]![j]!;
            copy[i]![j] = copy[j]![i]!;
            copy[j]![i] = temp;
        }
    }
    // reverse each row
    return flipPresent(copy);
}

export function flipPresent(present: number[][]) {
    const flipped: number[][] = copy2d(present);
    for (let i = 0; i < flipped.length; i++) {
        flipped[i]?.reverse();
    }
    return flipped;
}

export function computePresentOrientations(present: number[][]) {
    // Use a Map with string keys to deduplicate by value (Set uses reference equality)
    const seen = new Map<string, number[][]>();
    let copy = copy2d(present);
    const key = (arr: number[][]) => JSON.stringify(arr);

    seen.set(key(copy), copy);
    for (let i = 0; i < 3; i++) {
        copy = rotate90Degrees(copy);
        const k = key(copy);
        if (!seen.has(k)) {
            seen.set(k, copy2d(copy));
        }
    }

    return new Set(seen.values());
}

// Get all unique orientations including rotations and flips
export function getAllOrientations(present: number[][]) {
    const seen = new Map<string, number[][]>();
    const key = (arr: number[][]) => JSON.stringify(arr);

    // Add all rotations of original
    for (const o of computePresentOrientations(present)) {
        const k = key(o);
        if (!seen.has(k)) {
            seen.set(k, o);
        }
    }

    // Add all rotations of flipped
    for (const o of computePresentOrientations(flipPresent(present))) {
        const k = key(o);
        if (!seen.has(k)) {
            seen.set(k, o);
        }
    }

    return new Set(seen.values());
}

export function solveRegion(
    region: Region,
    presentOrientations: Set<number[][]>[],
    cellsPerShape: number[]
) {
    /**
     * See if we can fit all presents into the region.
     *
     * Presents can be rotated or flipped - meaning each present has up to 8 possible orientations.
     *
     * How do we know if a present fits? No position in the region has a value > 1 which implies overlap
     *
     * General algorithm:
     * 1. Create a list of the presents that need to be placed.
     * 2. For each present, try to place it in every possible position and orientation.
     * 3. If it fits, mark those positions as occupied and move to the next present.
     * 4. If we reach a point where a present cannot be placed, backtrack to the previous present and try a different position/orientation.
     * 5. If all presents are placed successfully, return true. If we exhaust all options, return false.
     *
     * We will determine "every possible position" using the upper left corner of the present as our starting point.
     *
     *
     * Is there some way we can make this easier?
     */

    // Quick check: if total cells needed > grid area, impossible
    const gridArea = region.dimensions.width * region.dimensions.height;
    let cellsNeeded = 0;
    for (let i = 0; i < region.presents.length; i++) {
        cellsNeeded += region.presents[i]! * cellsPerShape[i]!;
    }
    if (cellsNeeded > gridArea) {
        return false;
    }

    // Quick check: if the grid is big enough to hold all presents without overlap, it's possible
    if (gridArea >= 3 * 3 * region.presents.reduce((a, b) => a + b, 0)) {
        return true;
    }

    // Prepare list of presents to place
    const choices = [...region.presents];
    const isSolution = (state: State) => {
        return state.presents.every((count) => count === 0);
    };

    interface Candidate {
        choice: number;
        orientation: number[][];
        position: { x: number; y: number };
        linearPos: number;
        prevLastPos: number; // stored when candidate is chosen, for restoration
    }

    interface State {
        grid: number[][];
        presents: number[];
        dimensions: { width: number; height: number };
        lastPosition: number[]; // per shape type, the linear position of last placed piece
        remainingCells: number; // cells left to fill
    }

    const isValidCandidate = (state: State, candidate: Candidate) => {
        for (let dy = 0; dy < candidate.orientation.length; dy++) {
            for (let dx = 0; dx < candidate.orientation[0]!.length; dx++) {
                const gridY = candidate.position.y + dy;
                const gridX = candidate.position.x + dx;
                // TODO: optimize by only keeping track of candidate shape cells
                const candidateValue = candidate.orientation[dy]![dx]!;

                // continue if the candidate cell is empty
                if (candidateValue === 0) continue;

                // early exit if we are out of bounds
                if (
                    gridY > state.dimensions.height - 1 ||
                    gridX > state.dimensions.width - 1
                ) {
                    return false;
                }

                const newValue = state.grid[gridY]![gridX]! + candidateValue;
                // early exit if we overlap
                if (newValue > 1) {
                    return false;
                }
            }
        }
        return true;
    };

    const getCandidates = (state: State, _choices: number[]) => {
        // Quick check: if remaining pieces need more cells than available, prune
        let cellsStillNeeded = 0;
        for (let i = 0; i < state.presents.length; i++) {
            cellsStillNeeded += state.presents[i]! * cellsPerShape[i]!;
        }
        if (cellsStillNeeded > state.remainingCells) {
            return [];
        }

        // First pass: check if any shape has 0 valid placements (prune early)
        // Second pass: return candidates for the first shape that needs placing

        let firstShapeCandidates: Candidate[] | null = null;

        for (const [choice, count] of state.presents.entries()) {
            if (count !== 0) {
                const candidates: Candidate[] = [];
                const orientations = presentOrientations[choice]!;
                // Get the minimum position for this shape type (for ordering)
                const minPos = state.lastPosition[choice]!;

                for (const orientation of orientations) {
                    for (let y = 0; y < state.dimensions.height; y++) {
                        for (let x = 0; x < state.dimensions.width; x++) {
                            const linearPos = y * state.dimensions.width + x;
                            // Only consider positions >= lastPosition for this shape type
                            if (linearPos < minPos) continue;

                            const candidate: Candidate = {
                                choice,
                                orientation,
                                position: { x, y },
                                linearPos,
                                prevLastPos: minPos, // store current lastPosition for restoration
                            };
                            if (isValidCandidate(state, candidate))
                                candidates.push(candidate);
                        }
                    }
                }

                // If any shape has 0 valid placements, this branch is dead
                if (candidates.length === 0) {
                    return [];
                }

                // Save the first shape's candidates
                if (firstShapeCandidates === null) {
                    firstShapeCandidates = candidates;
                }
            }
        }
        return firstShapeCandidates ?? [];
    };

    const makeMove = (state: State, candidate: Candidate) => {
        // place the candidate in the region. If its okay, mark the present as used
        for (let dy = 0; dy < candidate.orientation.length; dy++) {
            for (let dx = 0; dx < candidate.orientation[0]!.length; dx++) {
                const gridY = candidate.position.y + dy;
                const gridX = candidate.position.x + dx;
                // continue if the candidate cell is empty
                if (candidate.orientation[dy]![dx]! === 0) continue;
                state.grid[gridY]![gridX]! += 1;
            }
        }

        // mark that we've placed one of those presents
        state.presents[candidate.choice]!--;

        // Update lastPosition for this shape type - next piece of same type must be at or after this position
        state.lastPosition[candidate.choice] = candidate.linearPos;

        // Update remaining cells
        state.remainingCells -= cellsPerShape[candidate.choice]!;
        return;
    };

    const unmakeMove = (state: State, candidate: Candidate) => {
        // remove the candidate from the region
        for (let dy = 0; dy < candidate.orientation.length; dy++) {
            for (let dx = 0; dx < candidate.orientation[0]!.length; dx++) {
                const gridY = candidate.position.y + dy;
                const gridX = candidate.position.x + dx;
                // continue if the candidate cell is empty
                if (candidate.orientation[dy]![dx]! === 0) continue;
                state.grid[gridY]![gridX]! -= 1;
            }
        }

        // Add the present back to the list
        state.presents[candidate.choice]!++;

        // Restore lastPosition for this shape type
        state.lastPosition[candidate.choice] = candidate.prevLastPos;

        // Restore remaining cells
        state.remainingCells += cellsPerShape[candidate.choice]!;
        return;
    };

    const startingState: State = {
        grid: copy2d(region.grid),
        presents: [...region.presents],
        dimensions: region.dimensions,
        lastPosition: Array(region.presents.length).fill(0), // all shape types start at position 0
        remainingCells: gridArea,
    };

    return backtrack(
        choices,
        startingState,
        isSolution,
        getCandidates,
        makeMove,
        unmakeMove
    );
}

export function solvePart1(s: string) {
    let result = 0;
    const { regions, presentSpecs } = parseInput(s);
    const presentOrientations = presentSpecs.map((present) =>
        getAllOrientations(present)
    );

    // Compute cells per shape type
    const cellsPerShape = presentSpecs.map((spec) => {
        let cells = 0;
        for (const row of spec) {
            for (const cell of row) {
                cells += cell;
            }
        }
        return cells;
    });

    for (const region of regions) {
        if (solveRegion(region, presentOrientations, cellsPerShape)) {
            result++;
        }
    }
    return result;
}

export function solvePart2(s: string) {
    return s;
}

if (require.main === module) {
    const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
    console.log(solvePart1(input));
    //console.log(solvePart2(input));
}
