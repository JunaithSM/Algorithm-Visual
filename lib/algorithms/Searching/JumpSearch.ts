import { Algorithm } from "../types";

export const JumpSearch: Algorithm = {
  id: "JumpSearch",
  name: "Jump Search",
  category: "Searching",
  description: "Searches a sorted array by jumping ahead by fixed steps (sqrt(n)) and performing linear search within the block.",
  code: {
    java: `class Solution {
    public int jumpSearch(int[] nums, int target) {
        int n = nums.length;
        int step = (int) Math.floor(Math.sqrt(n));
        int prev = 0;
        
        while (nums[Math.min(step, n) - 1] < target) {
            prev = step;
            step += (int) Math.floor(Math.sqrt(n));
            if (prev >= n) return -1;
        }
        
        while (nums[prev] < target) {
            prev++;
            if (prev == Math.min(step, n)) return -1;
        }
        
        if (nums[prev] == target) return prev;
        return -1;
    }
}`,
    c: `#include <math.h>

int jumpSearch(int* nums, int numsSize, int target) {
    int step = sqrt(numsSize);
    int prev = 0;
    
    while (nums[(step < numsSize ? step : numsSize) - 1] < target) {
        prev = step;
        step += sqrt(numsSize);
        if (prev >= numsSize) return -1;
    }
    
    while (nums[prev] < target) {
        prev++;
        if (prev == (step < numsSize ? step : numsSize)) return -1;
    }
    
    if (nums[prev] == target) return prev;
    return -1;
}`,
    cpp: `#include <vector>
#include <cmath>
#include <algorithm>

class Solution {
public:
    int jumpSearch(std::vector<int>& nums, int target) {
        int n = nums.size();
        int step = std::sqrt(n);
        int prev = 0;
        
        while (nums[std::min(step, n) - 1] < target) {
            prev = step;
            step += std::sqrt(n);
            if (prev >= n) return -1;
        }
        
        while (nums[prev] < target) {
            prev++;
            if (prev == std::min(step, n)) return -1;
        }
        
        if (nums[prev] == target) return prev;
        return -1;
    }
};`,
    python: `import math

class Solution:
    def jumpSearch(self, nums: list[int], target: int) -> int:
        n = len(nums)
        step = int(math.sqrt(n))
        prev = 0
        
        while nums[min(step, n) - 1] < target:
            prev = step
            step += int(math.sqrt(n))
            if prev >= n:
                return -1
                
        while nums[prev] < target:
            prev += 1
            if prev == min(step, n):
                return -1
                
        if nums[prev] == target:
            return prev
        return -1`,
    javascript: `var jumpSearch = function(nums, target) {
    const n = nums.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    
    while (nums[Math.min(step, n) - 1] < target) {
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) return -1;
    }
    
    while (nums[prev] < target) {
        prev++;
        if (prev === Math.min(step, n)) return -1;
    }
    
    if (nums[prev] === target) return prev;
    return -1;
};`,
    typescript: `function jumpSearch(nums: number[], target: number): number {
    const n = nums.length;
    let step = Math.floor(Math.sqrt(n));
    let prev = 0;
    
    while (nums[Math.min(step, n) - 1] < target) {
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) return -1;
    }
    
    while (nums[prev] < target) {
        prev++;
        if (prev === Math.min(step, n)) return -1;
    }
    
    if (nums[prev] === target) return prev;
    return -1;
}`,
    go: `package main

import (
	"math"
)

func jumpSearch(nums []int, target int) int {
	n := len(nums)
	step := int(math.Sqrt(float64(n)))
	prev := 0

	for nums[min(step, n)-1] < target {
		prev = step
		step += int(math.Sqrt(float64(n)))
		if prev >= n {
			return -1
		}
	}

	for nums[prev] < target {
		prev++
		if prev == min(step, n) {
			return -1
		}
	}

	if nums[prev] == target {
		return prev
	}
	return -1
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}`,
    rust: `impl Solution {
    pub fn jump_search(nums: Vec<i32>, target: i32) -> i32 {
        let n = nums.len();
        let mut step = (n as f64).sqrt() as usize;
        let mut prev = 0usize;

        while nums[step.min(n) - 1] < target {
            prev = step;
            step += (n as f64).sqrt() as usize;
            if prev >= n {
                return -1;
            }
        }

        while nums[prev] < target {
            prev += 1;
            if prev == step.min(n) {
                return -1;
            }
        }

        if nums[prev] == target {
            return prev as i32;
        }
        -1
    }
}`,
    csharp: `using System;

public class Solution {
    public int JumpSearch(int[] nums, int target) {
        int n = nums.Length;
        int step = (int)Math.Floor(Math.Sqrt(n));
        int prev = 0;

        while (nums[Math.Min(step, n) - 1] < target) {
            prev = step;
            step += (int)Math.Floor(Math.Sqrt(n));
            if (prev >= n) return -1;
        }

        while (nums[prev] < target) {
            prev++;
            if (prev == Math.Min(step, n)) return -1;
        }

        if (nums[prev] == target) return prev;
        return -1;
    }
}`,
    kotlin: `import kotlin.math.sqrt
import kotlin.math.min

class Solution {
    fun jumpSearch(nums: IntArray, target: Int): Int {
        val n = nums.size
        var step = sqrt(n.toDouble()).toInt()
        var prev = 0

        while (nums[min(step, n) - 1] < target) {
            prev = step
            step += sqrt(n.toDouble()).toInt()
            if (prev >= n) return -1
        }

        while (nums[prev] < target) {
            prev++
            if (prev == min(step, n)) return -1
        }

        if (nums[prev] == target) return prev
        return -1
    }
}`,
    swift: `import Foundation

class Solution {
    func jumpSearch(_ nums: [Int], _ target: Int) -> Int {
        let n = nums.count
        var step = Int(sqrt(Double(n)))
        var prev = 0

        while nums[min(step, n) - 1] < target {
            prev = step
            step += Int(sqrt(Double(n)))
            if prev >= n { return -1 }
        }

        while nums[prev] < target {
            prev += 1
            if prev == min(step, n) { return -1 }
        }

        if nums[prev] == target { return prev }
        return -1
    }
}`,
    php: `class Solution {
    function jumpSearch($nums, $target) {
        $n = count($nums);
        $step = (int)floor(sqrt($n));
        $prev = 0;

        while ($nums[min($step, $n) - 1] < $target) {
            $prev = $step;
            $step += (int)floor(sqrt($n));
            if ($prev >= $n) return -1;
        }

        while ($nums[$prev] < $target) {
            $prev++;
            if ($prev == min($step, $n)) return -1;
        }

        if ($nums[$prev] == $target) return $prev;
        return -1;
    }
}`,
    ruby: `def jump_search(nums, target)
  n = nums.length
  step = Math.sqrt(n).floor
  prev = 0

  while nums[[step, n].min - 1] < target
    prev = step
    step += Math.sqrt(n).floor
    return -1 if prev >= n
  end

  while nums[prev] < target
    prev += 1
    return -1 if prev == [step, n].min
  end

  nums[prev] == target ? prev : -1
end`,
    scala: `object Solution {
    def jumpSearch(nums: Array[Int], target: Int): Int = {
        val n = nums.length
        var step = math.sqrt(n.toDouble).toInt
        var prev = 0

        while (nums(math.min(step, n) - 1) < target) {
            prev = step
            step += math.sqrt(n.toDouble).toInt
            if (prev >= n) return -1
        }

        while (nums(prev) < target) {
            prev += 1
            if (prev == math.min(step, n)) return -1
        }

        if (nums(prev) == target) prev else -1
    }
}`,
    dart: `import 'dart:math';

class Solution {
  int jumpSearch(List<int> nums, int target) {
    int n = nums.length;
    int step = sqrt(n).floor();
    int prev = 0;

    while (nums[min(step, n) - 1] < target) {
      prev = step;
      step += sqrt(n).floor();
      if (prev >= n) return -1;
    }

    while (nums[prev] < target) {
      prev++;
      if (prev == min(step, n)) return -1;
    }

    if (nums[prev] == target) return prev;
    return -1;
  }
}`,
    lua: `function jumpSearch(nums, target)
    local n = #nums
    local step = math.floor(math.sqrt(n))
    local prev = 1

    while nums[math.min(step, n)] < target do
        prev = step
        step = step + math.floor(math.sqrt(n))
        if prev > n then return -1 end
    end

    while nums[prev] < target do
        prev = prev + 1
        if prev == math.min(step, n) + 1 then return -1 end
    end

    if nums[prev] == target then return prev - 1 end
    return -1
end`,
    perl: `sub jump_search {
    my ($nums, $target) = @_;
    my $n = scalar(@$nums);
    my $step = int(sqrt($n));
    my $prev = 0;

    while ($nums->[($step < $n ? $step : $n) - 1] < $target) {
        $prev = $step;
        $step += int(sqrt($n));
        return -1 if $prev >= $n;
    }

    while ($nums->[$prev] < $target) {
        $prev++;
        return -1 if $prev == ($step < $n ? $step : $n);
    }

    return $nums->[$prev] == $target ? $prev : -1;
}`,
    r: `jump_search <- function(nums, target) {
    n <- length(nums)
    step <- floor(sqrt(n))
    prev <- 1

    while (nums[min(step, n)] < target) {
        prev <- step
        step <- step + floor(sqrt(n))
        if (prev > n) return(-1)
    }

    while (nums[prev] < target) {
        prev <- prev + 1
        if (prev == min(step, n) + 1) return(-1)
    }

    if (nums[prev] == target) return(prev - 1)
    return(-1)
}`
  }
};
