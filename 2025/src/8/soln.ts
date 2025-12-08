import { join } from "path";
import { readFileSync } from "fs";
import { Heap } from "heap-js";

export const TEST_INPUT = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;

export interface Position {
    x: number;
    y: number;
    z: number;
}

export function parseInput(s: string) {
    return s.split("\n").map((line) => {
        const [x, y, z] = line.split(",").map(Number);
        return { x: x!, y: y!, z: z! };
    });
}

function calculateStraightLineDistance(a: Position, b: Position) {
    return Math.sqrt(
        (a.x - b.x) * (a.x - b.x) +
            (a.y - b.y) * (a.y - b.y) +
            (a.z - b.z) * (a.z - b.z)
    );
}

function computeDistances(positions: Position[]) {
    // minHeap of distances (distance, posAIndex, posBIndex)
    const minHeap = new Heap<[number, number, number]>((a, b) => a[0] - b[0]);
    let distances = [];
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const distance = calculateStraightLineDistance(
                positions[i]!,
                positions[j]!
            );
            minHeap.push([distance, i, j]);
            distances.push(distance);
        }
    }
    distances.sort((a, b) => a - b);
    return minHeap;
}

function mergeCircuits(
    leftCircuitIdx: number,
    rightCircuitNumber: number,
    circuits: number[][],
    boxToCircuitMap: Map<number, number>
) {
    const leftCircuit = circuits[leftCircuitIdx]!;
    const rightCircuit = circuits[rightCircuitNumber]!;

    for (const box of rightCircuit) {
        leftCircuit.push(box);
        boxToCircuitMap.set(box, leftCircuitIdx);
    }
    circuits[rightCircuitNumber] = [];
}

function addBoxToCircuit(
    boxIndex: number,
    circuitIndex: number,
    circuits: number[][],
    boxToCircuitMap: Map<number, number>
) {
    circuits[circuitIndex]!.push(boxIndex!);
    boxToCircuitMap.set(boxIndex, circuitIndex);
}

function buildCircuits(
    junctionBoxes: Position[],
    circuits: number[][],
    maxNumberOfConnections: number = Infinity
) {
    const distancesHeap = computeDistances(junctionBoxes);
    const boxToCircuitMap: Map<number, number> = new Map();
    let iterations = 0;
    let lastConnected: number[] = [];
    while (distancesHeap.size() > 0 && iterations < maxNumberOfConnections) {
        iterations++;
        const [_distance, boxAIndex, boxBIndex] = distancesHeap.pop() as [
            number,
            number,
            number
        ];

        let aIsInCircuit = boxToCircuitMap.has(boxAIndex);
        let bIsInCircuit = boxToCircuitMap.has(boxBIndex);

        if (aIsInCircuit && bIsInCircuit) {
            if (
                boxToCircuitMap.get(boxAIndex) ===
                boxToCircuitMap.get(boxBIndex)
            ) {
                continue; // both boxes are already in the same circuit
            } else {
                mergeCircuits(
                    boxToCircuitMap.get(boxAIndex)!,
                    boxToCircuitMap.get(boxBIndex)!,
                    circuits,
                    boxToCircuitMap
                );
                lastConnected = [boxAIndex, boxBIndex];
                continue;
            }
        }

        if (!aIsInCircuit && !bIsInCircuit) {
            // neither box is in a circuit
            const newCircuitIndex = circuits.length;
            circuits.push([boxAIndex, boxBIndex]);
            boxToCircuitMap.set(boxAIndex, newCircuitIndex);
            boxToCircuitMap.set(boxBIndex, newCircuitIndex);
            lastConnected = [boxAIndex, boxBIndex];
            continue;
        }

        if (aIsInCircuit && !bIsInCircuit) {
            const circuitIndex = boxToCircuitMap.get(boxAIndex)!;
            addBoxToCircuit(boxBIndex, circuitIndex, circuits, boxToCircuitMap);
            lastConnected = [boxAIndex, boxBIndex];
            continue;
        }

        if (!aIsInCircuit && bIsInCircuit) {
            const circuitIndex = boxToCircuitMap.get(boxBIndex)!;
            addBoxToCircuit(boxAIndex, circuitIndex, circuits, boxToCircuitMap);
            lastConnected = [boxAIndex, boxBIndex];
            continue;
        }
    }
    return lastConnected;
}

export function solvePart1(s: string, numberOfConnections = 10) {
    const junctionBoxes = parseInput(s);
    const circuits: number[][] = [];
    buildCircuits(junctionBoxes, circuits, numberOfConnections);
    const maxHeap = new Heap(Heap.maxComparator);
    for (const circuit of circuits) {
        maxHeap.push(circuit.length);
    }

    return (
        (maxHeap.pop() as number) *
        (maxHeap.pop() as number) *
        (maxHeap.pop() as number)
    );
}

export function solvePart2(s: string) {
    const junctionBoxes = parseInput(s);
    const circuits: number[][] = [];
    const lastConnected = buildCircuits(junctionBoxes, circuits);
    return (
        junctionBoxes[lastConnected[0]!]!.x *
        junctionBoxes[lastConnected[1]!]!.x
    );
}

if (require.main === module) {
    const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
    console.log(solvePart1(input, 1000));
    console.log(solvePart2(input));
}
