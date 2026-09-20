import { Algorithm } from "../types";

export const LinearSearch: Algorithm = {
  id: "LinearSearch",
  name: "Linear Search",
  category: "Searching",
  description: "Sequentially checks each element of the list until a match is found or the whole list has been searched.",
  code: {
    java: `class Solution {
    public int linearSearch(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) {
                return i;
            }
        }
        return -1;
    }
}`,
    c: `int linearSearch(int* nums, int numsSize, int target) {
    for (int i = 0; i < numsSize; i++) {
        if (nums[i] == target) {
            return i;
        }
    }
    return -1;
}`,
    cpp: `#include <vector>

class Solution {
public:
    int linearSearch(std::vector<int>& nums, int target) {
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] == target) {
                return i;
            }
        }
        return -1;
    }
};`,
    python: `class Solution:
    def linearSearch(self, nums: list[int], target: int) -> int:
        for i, num in enumerate(nums):
            if num == target:
                return i
        return -1`,
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var linearSearch = function(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === target) {
            return i;
        }
    }
    return -1;
};`,
    typescript: `function linearSearch(nums: number[], target: number): number {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === target) {
            return i;
        }
    }
    return -1;
}`,
    go: `func linearSearch(nums []int, target int) int {
    for i, num := range nums {
        if num == target {
            return i
        }
    }
    return -1
}`,
    rust: `impl Solution {
    pub fn linear_search(nums: Vec<i32>, target: i32) -> i32 {
        for (i, &num) in nums.iter().enumerate() {
            if num == target {
                return i as i32;
            }
        }
        -1
    }
}`,
    csharp: `public class Solution {
    public int LinearSearch(int[] nums, int target) {
        for (int i = 0; i < nums.Length; i++) {
            if (nums[i] == target) {
                return i;
            }
        }
        return -1;
    }
}`,
    kotlin: `class Solution {
    fun linearSearch(nums: IntArray, target: Int): Int {
        for (i in nums.indices) {
            if (nums[i] == target) {
                return i
            }
        }
        return -1
    }
}`,
    swift: `class Solution {
    func linearSearch(_ nums: [Int], _ target: Int) -> Int {
        for (index, num) in nums.enumerated() {
            if num == target {
                return index
            }
        }
        return -1;
    }
}`,
    php: `class Solution {
    function linearSearch($nums, $target) {
        foreach ($nums as $i => $num) {
            if ($num === $target) {
                return $i;
            }
        }
        return -1;
    }
}`,
    ruby: `def linear_search(nums, target)
  nums.each_with_index do |num, i|
    return i if num == target
  end
  -1
end`,
    scala: `object Solution {
    def linearSearch(nums: Array[Int], target: Int): Int = {
        for (i <- nums.indices) {
            if (nums(i) == target) return i
        }
        -1
    }
}`,
    dart: `class Solution {
  int linearSearch(List<int> nums, int target) {
    for (int i = 0; i < nums.length; i++) {
      if (nums[i] == target) return i;
    }
    return -1;
  }
}`,
    lua: `function linearSearch(nums, target)
    for i, num in ipairs(nums) do
        if num == target then
            return i - 1
        end
    end
    return -1
end`,
    perl: `sub linear_search {
    my ($nums, $target) = @_;
    for my $i (0 .. $#$nums) {
        return $i if $nums->[$i] == $target;
    }
    return -1;
}`,
    r: `linear_search <- function(nums, target) {
    for (i in seq_along(nums)) {
        if (nums[i] == target) {
            return(i - 1)
        }
    }
    return(-1)
}`
  }
};
