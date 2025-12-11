import { join } from "path";
import { readFileSync } from "fs";

export const SOURCE = "you";
export const SINK = "out";

export const TEST_INPUT = `aaa: you hhh
you: bbb ccc
bbb: ddd eee
ccc: ddd eee fff
ddd: ggg
eee: out
fff: out
ggg: out
hhh: ccc fff iii
iii: out`;

export function parseInput(s: string) {
    const edges = new Map<string, string[]>();
    s.split("\n").forEach((line) => {
        const [from, toList] = line.trim().split(":");
        edges.set(from!, toList!.trim().split(" ").filter(Boolean));
    });
    return edges;
}

export function solvePart1(s: string) {
    /**
     * "flow does move backwards" so we can assume no cycles.
     */
    let result = 0;
    const edges = parseInput(s);
    const queue: string[] = [SOURCE];

    while (queue.length > 0) {
        const current = queue.shift()!;
        if (current === SINK) {
            result++;
            continue;
        }

        const neighbors = edges.get(current) || [];
        for (const neighbor of neighbors) {
            queue.push(neighbor);
        }
    }
    return result;
}

const DAC = "dac";
const FFT = "fft";
const SVR = "svr";

export const TEST_INPUT_PART2 = `svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out`;

export function solvePart2(s: string) {
    const edges = parseInput(s);

    // Topologically sort
    const inDegree = new Map<string, number>();
    const allNodes = new Set<string>();

    for (const [from, toList] of edges) {
        allNodes.add(from);
        for (const to of toList) {
            allNodes.add(to);
            inDegree.set(to, (inDegree.get(to) || 0) + 1);
        }
    }

    const queue: string[] = [];
    for (const node of allNodes) {
        if (!inDegree.has(node) || inDegree.get(node) === 0) {
            queue.push(node);
        }
    }

    const topoOrder: string[] = [];
    while (queue.length > 0) {
        const node = queue.shift()!;
        topoOrder.push(node);
        for (const neighbor of edges.get(node) || []) {
            inDegree.set(neighbor, inDegree.get(neighbor)! - 1);
            if (inDegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        }
    }

    // Key: "node,seenDAC,seenFFT" -> count of paths reaching this state
    const counts = new Map<string, number>();

    const makeKey = (node: string, seenDAC: boolean, seenFFT: boolean) =>
        `${node},${seenDAC},${seenFFT}`;

    counts.set(makeKey(SVR, false, false), 1);

    for (const node of topoOrder) {
        for (const seenDAC of [false, true]) {
            for (const seenFFT of [false, true]) {
                const key = makeKey(node, seenDAC, seenFFT);
                const count = counts.get(key) || 0;

                if (count === 0) continue; // No paths with this state
                if (node === SINK) continue; // Don't propagate from sink

                // Propagate to neighbors
                for (const neighbor of edges.get(node) || []) {
                    const newSeenDAC = seenDAC || neighbor === DAC;
                    const newSeenFFT = seenFFT || neighbor === FFT;
                    const newKey = makeKey(neighbor, newSeenDAC, newSeenFFT);

                    counts.set(newKey, (counts.get(newKey) || 0) + count);
                }
            }
        }
    }

    return counts.get(makeKey(SINK, true, true)) || 0;
}

if (require.main === module) {
    const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
    console.log(solvePart1(input));
    console.log(solvePart2(input));
}
