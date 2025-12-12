import {
    TEST_INPUT,
    parseInput,
    solvePart1,
    solvePart2,
    solveRegion,
    computePresentOrientations,
    flipPresent,
    getAllOrientations,
} from "./soln";

describe("solve part 1", () => {
    it("parses input", () => {
        const { regions, presentSpecs } = parseInput(TEST_INPUT);

        // Check grid dimensions
        expect(regions[1]!.grid.length).toBe(5);
        expect(regions[1]!.dimensions!.height).toBe(5);
        expect(regions[1]!.grid[0]!.length).toBe(12);
        expect(regions[1]!.dimensions!.width).toBe(12);

        // check present specs
        expect(presentSpecs.length).toBe(6);
        expect(presentSpecs[0]!.length).toBe(3);
        expect(presentSpecs[0]![0]!.length).toBe(3);
        expect(presentSpecs[0]!).toStrictEqual([
            [1, 1, 1],
            [1, 1, 0],
            [1, 1, 0],
        ]);
    });

    it("solves regions", () => {
        const { regions, presentSpecs } = parseInput(TEST_INPUT);
        const presentOrientations = presentSpecs.map((present) =>
            getAllOrientations(present)
        );
        const cellsPerShape = presentSpecs.map((spec) => {
            let cells = 0;
            for (const row of spec) {
                for (const cell of row) {
                    cells += cell;
                }
            }
            return cells;
        });

        expect(solveRegion(regions[0]!, presentOrientations, cellsPerShape)).toBe(true);
        expect(solveRegion(regions[1]!, presentOrientations, cellsPerShape)).toBe(true);
        expect(solveRegion(regions[2]!, presentOrientations, cellsPerShape)).toBe(false);
    });

    it("solves the example", () => {
        expect(solvePart1(TEST_INPUT)).toBe(2);
    });
});

describe("solve part 2", () => {
    it("solves the example", () => {
        expect(solvePart2(TEST_INPUT)).toBe(TEST_INPUT);
    });
});

describe("computePresentOrientations", () => {
    it("returns 4 orientations for asymmetric 3x3 shape", () => {
        // Asymmetric shape has 4 distinct rotations
        const shape = [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 1],
        ];
        const orientations = computePresentOrientations(shape);
        expect(orientations.size).toBe(4);
    });

    it("returns 1 orientation for fully symmetric shape", () => {
        // Square is same in all rotations
        const square = [
            [1, 1],
            [1, 1],
        ];
        const orientations = computePresentOrientations(square);
        expect(orientations.size).toBe(1);
    });

    it("deduplicates identical orientations", () => {
        // Cross shape (shape 5 from puzzle) - symmetric under 90 degree rotation
        const cross = [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
        const orientations = computePresentOrientations(cross);
        expect(orientations.size).toBe(1);
    });
});

describe("flipPresent", () => {
    it("flips shape horizontally", () => {
        const shape = [
            [1, 0, 0],
            [1, 1, 0],
            [1, 1, 1],
        ];
        const flipped = flipPresent(shape);
        expect(flipped).toStrictEqual([
            [0, 0, 1],
            [0, 1, 1],
            [1, 1, 1],
        ]);
    });

    it("does not mutate original", () => {
        const original = [
            [1, 0],
            [1, 1],
        ];
        const originalCopy = JSON.parse(JSON.stringify(original));
        flipPresent(original);
        expect(original).toStrictEqual(originalCopy);
    });
});

describe("getAllOrientations (rotations + flip)", () => {
    it("returns 2 orientations for shape 5 (plus shape)", () => {
        // Shape 5: ###
        //          .#.
        //          ###
        // This is symmetric under 180 rotation, flip is same as original
        // So we get 2 unique: original and 90-degree rotation
        const shape5 = [
            [1, 1, 1],
            [0, 1, 0],
            [1, 1, 1],
        ];
        const allOrientations = getAllOrientations(shape5);
        expect(allOrientations.size).toBe(2);
    });

    it("returns 1 orientation for fully symmetric cross", () => {
        // Cross shape is same in all rotations and flips
        const cross = [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
        const allOrientations = getAllOrientations(cross);
        expect(allOrientations.size).toBe(1);
    });
});
