export interface Item {
    weight: number;
    value: number;
}

export interface DynamicValueItem {
    weight: number;
    valueFn: (dp: number[][], choice: number, weight: number) => number;
}

export function dynamicValueKnapsack(
    items: DynamicValueItem[],
    capacity: number
): { maxValue: number; selectedItems: number[] } {
    const n = items.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () =>
        Array(capacity + 1).fill(0)
    );

    // Build table dp[][] in bottom up manner
    for (let i = 1; i <= n; i++) {
        for (let w = 0; w <= capacity; w++) {
            if (items[i - 1]!.weight > w) {
                dp[i]![w] = dp[i - 1]![w]!;
            } else {
                dp[i]![w] = Math.max(
                    dp[i - 1]![w]!,
                    dp[i - 1]![w - items[i - 1]!.weight]! +
                        items[i - 1]!.valueFn(dp, i, w)
                );
            }
        }
    }

    // Find which items are included
    let w = capacity;
    const selectedItems: number[] = [];
    for (let i = n; i > 0; i--) {
        if (dp[i]![w] !== dp[i - 1]![w]!) {
            selectedItems.push(i - 1);
            w -= items[i - 1]!.weight;
        }
    }
    selectedItems.reverse();

    return { maxValue: dp[n]![capacity]!, selectedItems };
}

export function knapsack(
    items: Item[],
    capacity: number
): { maxValue: number; selectedItems: number[] } {
    const asDynamicValueItems: DynamicValueItem[] = items.map((item) => ({
        weight: item.weight,
        valueFn: () => item.value,
    }));
    return dynamicValueKnapsack(asDynamicValueItems, capacity);
}
