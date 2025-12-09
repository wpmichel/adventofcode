import { join } from "path";
import { readFileSync } from "fs";
import { Heap } from "heap-js";

export const TEST_INPUT = `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`;

export interface Position {
    x: number;
    y: number;
}

export function parseInput(s: string) {
    return s.split("\n").map((line) => {
        const [x, y] = line.trim().split(",").map(Number);
        return { x: x!, y: y! } as Position;
    });
}

function calculateArea(a: Position, b: Position) {
    return (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1);
}

export function solvePart1(s: string) {
    const positions = parseInput(s);
    let maxArea = 0;
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const area = calculateArea(positions[i]!, positions[j]!);
            maxArea = Math.max(area, maxArea);
        }
    }
    return maxArea;
}

export function getGreenBoundaryTiles(redTiles: Position[]) {
    const wrappedRedTiles = [redTiles[redTiles.length - 1]!, ...redTiles]; // wrap around
    const greenTiles: Position[] = [];

    for (let i = 0; i < wrappedRedTiles.length - 1; i++) {
        const currentRed = wrappedRedTiles[i]!;
        const nextRed = wrappedRedTiles[i + 1]!;

        // adjacent tiles in the list are guaranteed to be straight lines
        if (currentRed.x === nextRed.x) {
            for (
                let y = Math.min(currentRed.y, nextRed.y);
                y <= Math.max(currentRed.y, nextRed.y);
                y++
            ) {
                greenTiles.push({ x: currentRed.x, y });
            }
        } else {
            for (
                let x = Math.min(currentRed.x, nextRed.x);
                x <= Math.max(currentRed.x, nextRed.x);
                x++
            ) {
                greenTiles.push({ x, y: currentRed.y });
            }
        }
    }

    return greenTiles;
}

function isIntersectedByShape(
    posA: Position,
    posB: Position,
    shape: Position[]
) {
    for (let boundaryPoint of shape) {
        // check if the boundary point is in the middle of the rectangle
        if (
            boundaryPoint.x > Math.min(posA.x, posB.x) &&
            boundaryPoint.x < Math.max(posA.x, posB.x) &&
            boundaryPoint.y > Math.min(posA.y, posB.y) &&
            boundaryPoint.y < Math.max(posA.y, posB.y)
        ) {
            return true;
        }
    }
    return false;
}

export function solvePart2(s: string) {
    const redTiles = parseInput(s);
    const boundaryTiles = [...redTiles, ...getGreenBoundaryTiles(redTiles)];

    const maxHeap = new Heap<[number, Position, Position]>(
        (a, b) => b[0] - a[0]
    );

    for (let i = 0; i < redTiles.length; i++) {
        for (let j = i + 1; j < redTiles.length; j++) {
            const area = calculateArea(redTiles[i]!, redTiles[j]!);
            maxHeap.push([area, redTiles[i]!, redTiles[j]!]);
        }
    }
    const isTiled = new Map<string, boolean>();

    for (const tile of boundaryTiles) {
        isTiled.set(`${tile.x},${tile.y}`, true);
    }

    while (maxHeap.size() > 0) {
        const [area, posA, posB] = maxHeap.pop()!;
        if (!isIntersectedByShape(posA, posB, boundaryTiles)) {
            return area;
        }
    }

    return 0;
}

if (require.main === module) {
    const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
    console.log(solvePart1(input));
    console.log(solvePart2(input));
}
