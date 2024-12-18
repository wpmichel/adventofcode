from dataclasses import dataclass


def in_bounds(arr, y, x): 
    return 0 <= y < len(arr) and 0 <= x < len(arr[0])

@dataclass
class Coordinate: 
    x: int 
    y: int