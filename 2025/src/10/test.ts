import {
    lpSolveMachineForVoltages,
    TEST_INPUT,
    parseInput,
    solveMachineForVoltages,
    // solvePart1,
    solvePart2,
} from "./soln";

describe("solve part 1", () => {
    // it("parses input", () => {
    //     expect(parseInput(TEST_INPUT)[0]).toStrictEqual({
    //         goalState: [".", "#", "#", "."],
    //         currentState: [".", ".", ".", "."],
    //         buttons: [[3], [1, 3], [2], [2, 3], [0, 2], [0, 1]],
    //         joltageRequirements: [3, 5, 4, 7],
    //     });
    // });
    // it("solves the example", () => {
    //     expect(solvePart1(TEST_INPUT)).toBe(7);
    // });
});

describe("solve part 2", () => {
    it("solves for machine 1 with joltage", () => {
        const machines = parseInput(TEST_INPUT);
        expect(solveMachineForVoltages(machines[0]!, 11)).toBe(10);
    });

    it("solves for machine 1 with joltage LP", () => {
        const machines = parseInput(TEST_INPUT);
        expect(lpSolveMachineForVoltages(machines[0]!)).toBe(10);
    });

    it("solves the example", () => {
        expect(solvePart2(TEST_INPUT)).toBe(33);
    });
});
