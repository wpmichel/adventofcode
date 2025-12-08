import { join } from "path";
import { readFileSync } from "fs";

export const TEST_INPUT = `
.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`;

export function parseInput(s: string) {
    return s
        .split("\n")
        .filter(Boolean)
        .map((line) => Array.from(line.trim()));
}

interface Position {
    row: number;
    col: number;
}

function getStartingPosition(grid: string[][]) {
    for (let [idx, val] of (grid[0] ?? []).entries()) {
        if (val === "S") {
            return { row: 0, col: idx };
        }
    }
    throw new Error("Starting position not found");
}

export function solvePart1(s: string) {
    const grid = parseInput(s);
    const startingPosition = getStartingPosition(grid);
    let queue: Position[] = [startingPosition];
    let splitCount = 0;
    let occupiedColumns = new Set<number>([startingPosition.col]);
    while (queue.length > 0) {
        const currentPos = queue.shift()!;
        if (grid[currentPos.row]![currentPos.col]! === "^") {
            splitCount++;
            occupiedColumns.delete(currentPos.col);
            if (!occupiedColumns.has(currentPos.col - 1)) {
                queue.push({
                    row: currentPos.row + 1,
                    col: currentPos.col - 1,
                });
                occupiedColumns.add(currentPos.col - 1);
            }
            if (!occupiedColumns.has(currentPos.col + 1)) {
                queue.push({
                    row: currentPos.row + 1,
                    col: currentPos.col + 1,
                });
                occupiedColumns.add(currentPos.col + 1);
            }
        } else {
            if (currentPos.row + 1 < grid.length) {
                queue.push({
                    row: currentPos.row + 1,
                    col: currentPos.col,
                });
            }
        }
    }
    return splitCount;
}

// function travel(position: Position, grid: string[][]): number {
//     /** Count the number of timelines (terminal paths) */
//     if (position.row >= grid.length) {
//         return 1;
//     }
//     if (position.col < 0 || position.col >= grid[0]!.length) {
//         return 1;
//     }
//     if (grid[position.row]![position.col]! === "^") {
//         return (
//             travel({ row: position.row + 1, col: position.col - 1 }, grid) +
//             travel({ row: position.row + 1, col: position.col + 1 }, grid)
//         );
//     }
//     return travel({ row: position.row + 1, col: position.col }, grid);
// }

function travelMemoized(
    position: Position,
    grid: string[][],
    memo: Map<string, number>
): number {
    /** Count the number of timelines (terminal paths) with memoization */
    const key = `${position.row},${position.col}`;
    if (memo.has(key)) {
        return memo.get(key)!;
    }
    if (position.row >= grid.length) {
        return 1;
    }
    if (position.col < 0 || position.col >= grid[0]!.length) {
        return 1;
    }
    let result: number;
    if (grid[position.row]![position.col]! === "^") {
        result =
            travelMemoized(
                { row: position.row + 1, col: position.col - 1 },
                grid,
                memo
            ) +
            travelMemoized(
                { row: position.row + 1, col: position.col + 1 },
                grid,
                memo
            );
    } else {
        result = travelMemoized(
            { row: position.row + 1, col: position.col },
            grid,
            memo
        );
    }
    memo.set(key, result);
    return result;
}

export function solvePart2(s: string) {
    const grid = parseInput(s);
    const startingPosition = getStartingPosition(grid);
    return travelMemoized(startingPosition, grid, new Map());
}

if (require.main === module) {
    const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
    console.log(solvePart1(input));
    console.log(solvePart2(input));
}
