import { join } from "path";
import { readFileSync } from "fs";
import { equalTo, solve, Model, Constraint } from "yalps";

interface Machine {
    goalState: string[];
    currentState: string[];
    buttons: number[][];
    joltageRequirements: number[];
}

const ON = "#";
const OFF = ".";

export const TEST_INPUT = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

export function parseInput(s: string) {
    const machines: Machine[] = [];
    for (const line of s
        .trim()
        .split("\n")
        .map((l) => l.trim().split(" "))) {
        const goalStateStr = line[0]!;
        const buttonStrs = line.slice(1, line.length - 1);
        const joltageStr = line[line.length - 1]!;

        let goalState = Array.from(
            goalStateStr.substring(1, goalStateStr.length - 1)
        ).map((c) => c!);

        let buttons: number[][] = buttonStrs.map((buttonStr) => {
            if (buttonStr.length === 3) return [parseInt(buttonStr[1]!, 10)];
            return buttonStr
                .substring(1, buttonStr.length - 1)
                .split(",")
                .filter(Boolean)
                .map((n) => parseInt(n!, 10));
        });

        let joltageRequirements = joltageStr
            .substring(1, joltageStr.length - 1)
            .split(",")
            .map((n) => parseInt(n!, 10));

        machines.push({
            goalState,
            currentState: Array(goalState.length).fill(OFF),
            buttons,
            joltageRequirements,
        });
    }
    return machines;
}

function stateKey(state: (string | number)[]) {
    return state.join("");
}

function solveMachine(machine: Machine, maxPresses = 1000) {
    /**
     * Central conceit here is that we have some order of button that will produce the goal state
     * from the current state. We know that we could potentially see the same state multiple times and
     * if we aren't careful we could press an infinite amount of buttons. However, we know that our states are fixed,
     * so we can construct a graph of our possible states, our starting states, and the edges between them (buttons)
     * and use an algorithm like BFS to find the shortest path from start to goal.
     */
    const visited = new Set<string>();
    const queue: { state: string[]; presses: number }[] = [
        { state: machine.currentState, presses: 0 },
    ];

    while (queue.length > 0) {
        const { state, presses } = queue.shift()!;
        if (presses > maxPresses) {
            throw new Error("Exceeded max presses", {
                cause: JSON.stringify(machine),
            });
        }

        const key = stateKey(state);
        if (visited.has(key)) continue;
        visited.add(key);

        if (stateKey(state) === stateKey(machine.goalState)) {
            return presses;
        }
        for (let i = 0; i < machine.buttons.length; i++) {
            const button = machine.buttons[i]!;
            const newState = [...state];
            for (const index of button) {
                newState[index!] = newState[index!] === ON ? OFF : ON;
            }
            queue.push({ state: newState, presses: presses + 1 });
        }
    }

    throw new Error("No solution found", { cause: JSON.stringify(machine) });
}

export function solvePart1(s: string) {
    const machines = parseInput(s);
    let result = 0;
    for (const machine of machines) {
        result += solveMachine(machine);
    }
    return result;
}

export function lpSolveMachineForVoltages(machine: Machine) {
    const constraints = new Map<string, Constraint>();
    for (const [idx, joltage] of machine.joltageRequirements.entries()) {
        constraints.set(`c${idx}`, equalTo(joltage));
    }
    const variables = new Map<string, Map<string, number>>();
    for (const [idx, button] of machine.buttons.entries()) {
        const varMap = new Map<string, number>();
        for (const joltageIdx of button) {
            varMap.set(`c${joltageIdx}`, 1);
            varMap.set("profit", 1);
        }
        variables.set(`v${idx}`, varMap);
    }

    // Set up the linear programming problem
    // Minimize: sum of button presses
    // Subject to: buttonMatrix * x >= joltageRequirements
    // and x >= 0
    const model: Model = {
        direction: "minimize",
        objective: "profit",
        constraints,
        variables,
        integers: true,
    };
    return solve(model).result;
}

export function solvePart2(s: string) {
    const machines = parseInput(s);
    let result = 0;
    for (const machine of machines) {
        result += lpSolveMachineForVoltages(machine);
    }
    return result;
}

if (require.main === module) {
    const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
    console.log(solvePart1(input));
    console.log(solvePart2(input));
}
