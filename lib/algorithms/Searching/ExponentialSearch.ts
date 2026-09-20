import { Algorithm } from "../types";

export const ExponentialSearch: Algorithm = {
  id: "ExponentialSearch",
  name: "Exponential Search",
  category: "Searching",
  description: "Finds range where search key may be present by doubling index, then performs binary search in that range.",
  code: {
    java: `import java.util.Arrays;

class Solution {
    public int exponentialSearch(int[] nums, int target) {
        int n = nums.length;
        if (n == 0) return -1;
        if (nums[0] == target) return 0;
        
        int i = 1;
        while (i < n && nums[i] <= target) {
            i = i * 2;
        }
        
        int index = Arrays.binarySearch(nums, i / 2, Math.min(i, n), target);
        return index >= 0 ? index : -1;
    }
}`,
    c: `#include <stdio.h>

int binarySearchRange(int* nums, int left, int right, int target) {
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

int exponentialSearch(int* nums, int numsSize, int target) {
    if (numsSize == 0) return -1;
    if (nums[0] == target) return 0;

    int i = 1;
    while (i < numsSize && nums[i] <= target) {
        i = i * 2;
    }

    int right = i < numsSize ? i : numsSize - 1;
    return binarySearchRange(nums, i / 2, right, target);
}`,
    cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int exponentialSearch(std::vector<int>& nums, int target) {
        int n = nums.size();
        if (n == 0) return -1;
        if (nums[0] == target) return 0;
        
        int i = 1;
        while (i < n && nums[i] <= target) {
            i = i * 2;
        }
        
        auto it = std::lower_bound(nums.begin() + i / 2, nums.begin() + std::min(i, n), target);
        if (it != nums.end() && *it == target) {
            return std::distance(nums.begin(), it);
        }
        return -1;
    }
};`,
    python: `import bisect

class Solution:
    def exponentialSearch(self, nums: list[int], target: int) -> int:
        n = len(nums)
        if n == 0: return -1
        if nums[0] == target: return 0
        
        i = 1
        while i < n and nums[i] <= target:
            i *= 2
            
        idx = bisect.bisect_left(nums, target, i // 2, min(i, n))
        if idx < n and nums[idx] == target:
            return idx
        return -1`,
    javascript: `var exponentialSearch = function(nums, target) {
    const n = nums.length;
    if (n === 0) return -1;
    if (nums[0] === target) return 0;
    
    let i = 1;
    while (i < n && nums[i] <= target) {
        i *= 2;
    }
    
    let left = Math.floor(i / 2);
    let right = Math.min(i, n - 1);
    
    while (left <= right) {
        let mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
};`,
    typescript: `function exponentialSearch(nums: number[], target: number): number {
    const n = nums.length;
    if (n === 0) return -1;
    if (nums[0] === target) return 0;
    
    let i = 1;
    while (i < n && nums[i] <= target) {
        i *= 2;
    }
    
    let left = Math.floor(i / 2);
    let right = Math.min(i, n - 1);
    
    while (left <= right) {
        let mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
    go: `func exponentialSearch(nums []int, target int) int {
    n := len(nums)
    if n == 0 { return -1 }
    if nums[0] == target { return 0 }

    i := 1
    for i < n && nums[i] <= target {
        i *= 2
    }

    left := i / 2
    right := min(i, n-1)

    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target { return mid }
        if nums[mid] < target { left = mid + 1 } else { right = mid - 1 }
    }
    return -1
}`,
    rust: `impl Solution {
    pub fn exponential_search(nums: Vec<i32>, target: i32) -> i32 {
        let n = nums.len();
        if n == 0 { return -1; }
        if nums[0] == target { return 0; }

        let mut i = 1usize;
        while i < n && nums[i] <= target {
            i *= 2;
        }

        let mut left = i / 2;
        let mut right = i.min(n - 1);

        while left <= right {
            let mid = left + (right - left) / 2;
            if nums[mid] == target { return mid as i32; }
            if nums[mid] < target { left = mid + 1; }
            else { if mid == 0 { break; } right = mid - 1; }
        }
        -1
    }
}`,
    csharp: `using System;

public class Solution {
    public int ExponentialSearch(int[] nums, int target) {
        int n = nums.Length;
        if (n == 0) return -1;
        if (nums[0] == target) return 0;

        int i = 1;
        while (i < n && nums[i] <= target) {
            i *= 2;
        }

        int left = i / 2;
        int right = Math.Min(i, n - 1);

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
    kotlin: `import kotlin.math.min

class Solution {
    fun exponentialSearch(nums: IntArray, target: Int): Int {
        val n = nums.size
        if (n == 0) return -1
        if (nums[0] == target) return 0

        var i = 1
        while (i < n && nums[i] <= target) {
            i *= 2
        }

        var left = i / 2
        var right = min(i, n - 1)

        while (left <= right) {
            val mid = left + (right - left) / 2
            if (nums[mid] == target) return mid
            if (nums[mid] < target) left = mid + 1
            else right = mid - 1
        }
        return -1
    }
}`,
    swift: `class Solution {
    func exponentialSearch(_ nums: [Int], _ target: Int) -> Int {
        let n = nums.count
        if n == 0 { return -1 }
        if nums[0] == target { return 0 }

        var i = 1
        while i < n && nums[i] <= target {
            i *= 2
        }

        var left = i / 2
        var right = min(i, n - 1)

        while left <= right {
            let mid = left + (right - left) / 2
            if nums[mid] == target { return mid }
            if nums[mid] < target { left = mid + 1 }
            else { right = mid - 1 }
        }
        return -1
    }
}`,
    php: `class Solution {
    function exponentialSearch($nums, $target) {
        $n = count($nums);
        if ($n == 0) return -1;
        if ($nums[0] == $target) return 0;

        $i = 1;
        while ($i < $n && $nums[$i] <= $target) {
            $i *= 2;
        }

        $left = intdiv($i, 2);
        $right = min($i, $n - 1);

        while ($left <= $right) {
            $mid = intdiv($left + $right, 2);
            if ($nums[$mid] == $target) return $mid;
            if ($nums[$mid] < $target) $left = $mid + 1;
            else $right = $mid - 1;
        }
        return -1;
    }
}`,
    ruby: `def exponential_search(nums, target)
  n = nums.length
  return -1 if n == 0
  return 0 if nums[0] == target

  i = 1
  while i < n && nums[i] <= target
    i *= 2
  end

  left = i / 2
  right = [i, n - 1].min

  while left <= right
    mid = left + (right - left) / 2
    return mid if nums[mid] == target
    if nums[mid] < target
      left = mid + 1
    else
      right = mid - 1
    end
  end
  -1
end`,
    scala: `object Solution {
    def exponentialSearch(nums: Array[Int], target: Int): Int = {
        val n = nums.length
        if (n == 0) return -1
        if (nums(0) == target) return 0

        var i = 1
        while (i < n && nums(i) <= target) {
            i *= 2
        }

        var left = i / 2
        var right = math.min(i, n - 1)

        while (left <= right) {
            val mid = left + (right - left) / 2
            if (nums(mid) == target) return mid
            if (nums(mid) < target) left = mid + 1
            else right = mid - 1
        }
        -1
    }
}`,
    dart: `import 'dart:math';

class Solution {
  int exponentialSearch(List<int> nums, int target) {
    int n = nums.length;
    if (n == 0) return -1;
    if (nums[0] == target) return 0;

    int i = 1;
    while (i < n && nums[i] <= target) {
      i *= 2;
    }

    int left = i ~/ 2;
    int right = min(i, n - 1);

    while (left <= right) {
      int mid = left + (right - left) ~/ 2;
      if (nums[mid] == target) return mid;
      if (nums[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }
}`,
    lua: `function exponentialSearch(nums, target)
    local n = #nums
    if n == 0 then return -1 end
    if nums[1] == target then return 0 end

    local i = 2
    while i <= n and nums[i] <= target do
        i = i * 2
    end

    local left = math.floor(i / 2)
    local right = math.min(i, n)

    while left <= right do
        local mid = math.floor(left + (right - left) / 2)
        if nums[mid] == target then return mid - 1 end
        if nums[mid] < target then left = mid + 1
        else right = mid - 1 end
    end
    return -1
end`,
    perl: `sub exponential_search {
    my ($nums, $target) = @_;
    my $n = scalar(@$nums);
    return -1 if $n == 0;
    return 0 if $nums->[0] == $target;

    my $i = 1;
    while ($i < $n && $nums->[$i] <= $target) {
        $i *= 2;
    }

    my $left = int($i / 2);
    my $right = $i < $n - 1 ? $i : $n - 1;

    while ($left <= $right) {
        my $mid = int($left + ($right - $left) / 2);
        return $mid if $nums->[$mid] == $target;
        if ($nums->[$mid] < $target) { $left = $mid + 1; }
        else { $right = $mid - 1; }
    }
    return -1;
}`,
    r: `exponential_search <- function(nums, target) {
    n <- length(nums)
    if (n == 0) return(-1)
    if (nums[1] == target) return(0)

    i <- 2
    while (i <= n && nums[i] <= target) {
        i <- i * 2
    }

    left <- floor(i / 2)
    right <- min(i, n)

    while (left <= right) {
        mid <- left + (right - left) %/% 2
        if (nums[mid] == target) return(mid - 1)
        if (nums[mid] < target) { left <- mid + 1 }
        else { right <- mid - 1 }
    }
    return(-1)
}`
  }
};
