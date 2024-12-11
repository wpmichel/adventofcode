import doctest

puzzle_input = """5178527 8525 22 376299 3 69312 0 275"""
NEWLINE = '\n'

def parse_input(string: str): 
    string = string.strip(NEWLINE)
    return list(map(int, string.split(' ')))

doctest.run_docstring_examples(parse_input, None)


# puzzle 2
import timeit


def blink(stones):
    """
    >>> blink([0, 1, 10, 99, 999])
    [1, 2024, 1, 0, 9, 9, 2021976]
    """
    result = []
    
    # Process all stones simultaneously
    for stone in stones:
        if stone == 0:
            result.append(1)
        else:
            stone_str = str(stone)
            if len(stone_str) % 2 == 0:
                mid = len(stone_str) // 2
                left = int(stone_str[:mid])
                right = int(stone_str[mid:])
                result.extend([left, right])
            else:
                result.append(stone * 2024)
    
    return result

def process_chunk(stones, remaining_blinks):
    """Process a chunk of stones for the given number of blinks."""
    total = 0
    working_set = stones
    for _ in range(remaining_blinks):
        working_set = blink(working_set)
        if len(working_set) > 50_000:
            # Split into smaller chunks and process recursively
            mid = len(working_set) // 2
            total += process_chunk(working_set[:mid], remaining_blinks - (_ + 1))
            total += process_chunk(working_set[mid:], remaining_blinks - (_ + 1))
            return total
    return len(working_set)

def blinks(stones, num_blinks):
    """Process all stones for the given number of blinks, splitting large sets."""
    total = 0
    for idx, stone in enumerate(stones):
        print(idx)
        total += process_chunk([stone], num_blinks)
    return total

doctest.run_docstring_examples(blink, None)
stones = parse_input(puzzle_input)
print(blinks(stones, 75))