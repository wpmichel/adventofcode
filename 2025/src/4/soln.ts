import { join } from "path";
import { readFileSync } from "fs";

export const TEST_INPUT = `
..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.
`;

const ROLL_SYMBOL = "@";
const REMOVED_SYMBOL = "x";

export function parseInput(s: string) {
    return s
        .trim()
        .split("\n")
        .map((line) => Array.from(line.trim()));
}

function* getAdjacentCells(
    grid: string[][],
    row: number,
    col: number
): Generator<string, void, unknown> {
    const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];

    for (const [y, x] of directions) {
        const dRow = row + y!;
        const dCol = col + x!;
        if (
            dRow < 0 ||
            dRow >= grid.length ||
            dCol < 0 ||
            dCol >= grid[0]!.length
        ) {
            continue;
        }
        yield grid[dRow]![dCol]!;
    }
}

function getAccessibleRolls(grid: string[][]) {
    let accessibleRolls = [];
    for (const [rowIdx, row] of grid.entries()) {
        for (const [colIdx, col] of row.entries()) {
            if (col === ROLL_SYMBOL) {
                let adjacentRolls = 0;
                for (const cell of getAdjacentCells(grid, rowIdx, colIdx)) {
                    if (cell === ROLL_SYMBOL) {
                        adjacentRolls++;
                    }
                    if (adjacentRolls >= 4) {
                        break;
                    }
                }

                if (adjacentRolls < 4) {
                    accessibleRolls.push([rowIdx, colIdx]);
                }
            }
        }
    }
    return accessibleRolls;
}

export function solvePart1(s: string) {
    const grid = parseInput(s);
    return getAccessibleRolls(grid).length;
}

export function solvePart2(s: string) {
    const grid = parseInput(s);
    let accessibleRolls = [];
    let removedRolls = 0;
    do {
        accessibleRolls = getAccessibleRolls(grid);
        removedRolls += accessibleRolls.length;
        for (const [rowIdx, colIdx] of accessibleRolls) {
            grid[rowIdx!]![colIdx!] = REMOVED_SYMBOL;
        }
    } while (accessibleRolls.length > 0);
    return removedRolls;
}

if (require.main === module) {
    const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
    console.log(solvePart1(input));
    console.log(solvePart2(input));
}
