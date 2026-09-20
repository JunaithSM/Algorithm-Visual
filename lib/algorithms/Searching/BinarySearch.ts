import { Algorithm } from "../types";

export const BinarySearch: Algorithm = {
  id: "BinarySearch",
  name: "Binary Search",
  category: "Searching",
  description: "Efficient search algorithm that finds the position of a target value within a sorted array using divide and conquer.",
  code: {
    java: `class Solution {
    public int binarySearch(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
    c: `int binarySearch(int* nums, int numsSize, int target) {
    int left = 0, right = numsSize - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
    cpp: `#include <vector>

class Solution {
public:
    int binarySearch(std::vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
};`,
    python: `class Solution:
    def binarySearch(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return -1`,
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var binarySearch = function(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        let mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
};`,
    typescript: `function binarySearch(nums: number[], target: number): number {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        let mid = Math.floor(left + (right - left) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
    go: `func binarySearch(nums []int, target int) int {
    left, right := 0, len(nums)-1
    for left <= right {
        mid := left + (right-left)/2
        if nums[mid] == target {
            return mid
        }
        if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}`,
    rust: `impl Solution {
    pub fn binary_search(nums: Vec<i32>, target: i32) -> i32 {
        let mut left = 0i32;
        let mut right = (nums.len() as i32) - 1;
        while left <= right {
            let mid = left + (right - left) / 2;
            if nums[mid as usize] == target {
                return mid;
            }
            if nums[mid as usize] < target {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        -1
    }
}`,
    csharp: `public class Solution {
    public int BinarySearch(int[] nums, int target) {
        int left = 0, right = nums.Length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
    kotlin: `class Solution {
    fun binarySearch(nums: IntArray, target: Int): Int {
        var left = 0
        var right = nums.size - 1
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
    func binarySearch(_ nums: [Int], _ target: Int) -> Int {
        var left = 0
        var right = nums.count - 1
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
    function binarySearch($nums, $target) {
        $left = 0;
        $right = count($nums) - 1;
        while ($left <= $right) {
            $mid = intdiv($left + $right, 2);
            if ($nums[$mid] === $target) return $mid;
            if ($nums[$mid] < $target) $left = $mid + 1;
            else $right = $mid - 1;
        }
        return -1;
    }
}`,
    ruby: `def binary_search(nums, target)
  left, right = 0, nums.length - 1
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
    def binarySearch(nums: Array[Int], target: Int): Int = {
        var left = 0
        var right = nums.length - 1
        while (left <= right) {
            val mid = left + (right - left) / 2
            if (nums(mid) == target) return mid
            if (nums(mid) < target) left = mid + 1
            else right = mid - 1
        }
        -1
    }
}`,
    dart: `class Solution {
  int binarySearch(List<int> nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
      int mid = left + (right - left) ~/ 2;
      if (nums[mid] == target) return mid;
      if (nums[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }
}`,
    lua: `function binarySearch(nums, target)
    local left, right = 1, #nums
    while left <= right do
        local mid = math.floor(left + (right - left) / 2)
        if nums[mid] == target then return mid - 1 end
        if nums[mid] < target then left = mid + 1
        else right = mid - 1 end
    end
    return -1
end`,
    perl: `sub binary_search {
    my ($nums, $target) = @_;
    my ($left, $right) = (0, $#$nums);
    while ($left <= $right) {
        my $mid = int($left + ($right - $left) / 2);
        return $mid if $nums->[$mid] == $target;
        if ($nums->[$mid] < $target) { $left = $mid + 1; }
        else { $right = $mid - 1; }
    }
    return -1;
}`,
    r: `binary_search <- function(nums, target) {
    left <- 1
    right <- length(nums)
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
