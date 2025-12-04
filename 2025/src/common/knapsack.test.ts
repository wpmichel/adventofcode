import { knapsack, Item } from "./knapsack";

describe("knapsack", () => {
    it("returns correct maxValue and selectedItems for basic case", () => {
        const items: Item[] = [
            { weight: 1, value: 1 },
            { weight: 3, value: 4 },
            { weight: 4, value: 5 },
            { weight: 5, value: 7 },
        ];
        const capacity = 7;
        const result = knapsack(items, capacity);
        expect(result.maxValue).toBe(9);
        expect(result.selectedItems.sort()).toEqual([1, 2]);
    });

    it("returns zero for empty items", () => {
        const items: Item[] = [];
        const capacity = 10;
        const result = knapsack(items, capacity);
        expect(result.maxValue).toBe(0);
        expect(result.selectedItems).toEqual([]);
    });

    it("returns zero for zero capacity", () => {
        const items: Item[] = [
            { weight: 2, value: 3 },
            { weight: 3, value: 4 },
        ];
        const capacity = 0;
        const result = knapsack(items, capacity);
        expect(result.maxValue).toBe(0);
        expect(result.selectedItems).toEqual([]);
    });

    it("selects single item if only one fits", () => {
        const items: Item[] = [
            { weight: 5, value: 10 },
            { weight: 10, value: 20 },
        ];
        const capacity = 5;
        const result = knapsack(items, capacity);
        expect(result.maxValue).toBe(10);
        expect(result.selectedItems).toEqual([0]);
    });

    it("selects no items if none fit", () => {
        const items: Item[] = [
            { weight: 6, value: 10 },
            { weight: 7, value: 20 },
        ];
        const capacity = 5;
        const result = knapsack(items, capacity);
        expect(result.maxValue).toBe(0);
        expect(result.selectedItems).toEqual([]);
    });

    it("handles items with zero value", () => {
        const items: Item[] = [
            { weight: 1, value: 0 },
            { weight: 2, value: 0 },
            { weight: 3, value: 5 },
        ];
        const capacity = 3;
        const result = knapsack(items, capacity);
        expect(result.maxValue).toBe(5);
        expect(result.selectedItems).toEqual([2]);
    });

    it("handles items with zero weight", () => {
        const items: Item[] = [
            { weight: 0, value: 10 },
            { weight: 2, value: 5 },
        ];
        const capacity = 2;
        const result = knapsack(items, capacity);
        expect(result.maxValue).toBe(15);
        expect(result.selectedItems.sort()).toEqual([0, 1]);
    });

    it("handles all items fitting", () => {
        const items: Item[] = [
            { weight: 1, value: 2 },
            { weight: 2, value: 3 },
            { weight: 3, value: 4 },
        ];
        const capacity = 6;
        const result = knapsack(items, capacity);
        expect(result.maxValue).toBe(9);
        expect(result.selectedItems.sort()).toEqual([0, 1, 2]);
    });

    it("handles duplicate items", () => {
        const items: Item[] = [
            { weight: 2, value: 3 },
            { weight: 2, value: 3 },
            { weight: 2, value: 3 },
        ];
        const capacity = 4;
        const result = knapsack(items, capacity);
        expect(result.maxValue).toBe(6);
        expect(result.selectedItems.length).toBe(2);
    });
});
