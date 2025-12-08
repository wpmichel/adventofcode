import { join } from "path";
import { readFileSync } from "fs";

export const TEST_INPUT = `
123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  `;

export function parseInput(s: string) {
    const lines = s
        .trim()
        .split("\n")
        .map((line) =>
            line
                .trim()
                .split(" ")
                .map((s) => s.trim())
                .filter(Boolean)
        );

    const numbers = lines
        .splice(0, lines.length - 1)
        .filter(Boolean)
        .map((line) => line.map(Number));
    const operators = lines.at(lines.length - 1)?.filter(Boolean);
    return { numbers, operators };
}

export function parseInputV2(s: string) {
    const lines = s
        .trim()
        .split("\n")
        .map((line) => Array.from(line));
    const numbers = lines.splice(0, lines.length - 1)!;
    const operators = lines.at(lines.length - 1)!;
    return { numbers, operators };
}
const operatorMap = {
    "+": (a: number, b: number) => a + b,
    "*": (a: number, b: number) => a * b,
};

export function solvePart1(s: string) {
    const { numbers, operators } = parseInput(s);
    let result = 0;
    for (let column = 0; column < numbers![0]!.length; column++) {
        let columnResult = numbers![0]![column]!;
        for (let row = 1; row < numbers.length; row++) {
            const operator = operators![column];
            const func = operatorMap[operator as keyof typeof operatorMap];
            columnResult = func(columnResult, numbers![row]![column]!);
        }
        result += columnResult;
    }

    return result;
}

export function solvePart2(s: string) {
    const { numbers, operators } = parseInputV2(s);

    let result = 0;
    let lastOperatorIdx = 0;
    /**
     * iterate through operators to find problem bounardies
     * Once boundary is known, iterate through numbers and compute the result
     */
    const numCols = numbers[0]!.length;
    for (let op = 1; op <= operators.length; op++) {
        const isLastIteration = op === operators.length;
        if (!isLastIteration && operators[op]! === " ") {
            continue;
        }

        // found an operator, compute result for the previous segment (lastOperatorIdx -> op)
        let segmentNumbers = [];
        const endCol = isLastIteration ? numCols : op - 1;
        for (let col = lastOperatorIdx; col < endCol; col++) {
            // op - 1 because there is a space before the operator and after the last set
            let colNumber = "";
            for (let row = 0; row < numbers.length; row++) {
                const char = numbers[row]![col]!;
                if (char !== " ") {
                    colNumber += char;
                }
            }
            segmentNumbers.push(Number(colNumber));
        }
        if (segmentNumbers.length === 0) {
            throw new Error(
                `No numbers found in segment ${lastOperatorIdx} to ${op}`
            );
        }
        let segmentResult = segmentNumbers.reduce((acc, curr) => {
            const operator = operators[lastOperatorIdx]!;
            const func = operatorMap[operator as keyof typeof operatorMap];
            return func(acc, curr);
        });
        result += segmentResult;
        lastOperatorIdx = op;
    }

    return result;
}

if (require.main === module) {
    const input = readFileSync(join(__dirname, "input.txt"), "utf-8");
    console.log(solvePart1(input));
    console.log(solvePart2(input));
}
