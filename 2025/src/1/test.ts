import { TEST_INPUT, rotate, parseInput, crackLock } from "./part1";
import { countZeroHits, crackLock as crackLockV2 } from "./part2";
import { describe, expect, it } from "@jest/globals";

describe("part 1", () => {
    it("parses input", () => {
        const rotations = parseInput(TEST_INPUT);
        expect(rotations.length).toBe(10);
        expect(rotations.at(0)).toEqual({ direction: "L", clicks: 68 });
        expect(rotations.at(9)).toEqual({ direction: "L", clicks: 82 });
    });

    it("rotates left", () => {
        // simple no wrap around
        expect(rotate(10, 9, "L")).toBe(1);

        // simple wrap around
        expect(rotate(0, 1, "L")).toBe(99);

        // complex wrap around
        expect(rotate(0, 99, "L")).toBe(1);
        expect(rotate(2, 3, "L")).toBe(99);
        expect(rotate(0, 198, "L")).toBe(2);
    });

    it("rotates right", () => {
        // simple no wrap around
        expect(rotate(10, 1, "R")).toBe(11);
        expect(rotate(0, 1, "R")).toBe(1);

        // simple wrap around
        expect(rotate(99, 1, "R")).toBe(0);

        // complext wrap around
        expect(rotate(0, 99, "R")).toBe(99);
        expect(rotate(99, 2, "R")).toBe(1);
        expect(rotate(0, 198, "R")).toBe(98);
    });

    it("cracks the lock", () => {
        const rotations = parseInput(TEST_INPUT);
        const zeroCount = crackLock(rotations);
        expect(zeroCount).toBe(3);
    });
});

describe("part2", () => {
    it("counts zero hits going left", () => {
        expect(countZeroHits(50, 10, "L")).toBe(0); // Left, not passing 0
        expect(countZeroHits(1, 198, "L")).toBe(2); // Left, passing 0
    });

    it("counts zero hits going right", () => {
        expect(countZeroHits(99, 2, "R")).toBe(1); // Right, one rotation
        expect(countZeroHits(99, 1000, "R")).toBe(10); // Right, many
    });

    it("counts zero hits when we start at 0", () => {
        expect(countZeroHits(0, 300, "R")).toBe(3);
        expect(countZeroHits(0, 300, "L")).toBe(3);
    });

    it("counts zero hits when we don't move at all", () => {
        expect(countZeroHits(99, 0, "R")).toBe(0);
        expect(countZeroHits(1, 0, "L")).toBe(0);
    });

    it("cracks the lock", () => {
        const rotations = parseInput(TEST_INPUT);
        const zeroCount = crackLockV2(rotations);
        expect(zeroCount).toBe(6);
    });
});
