import { Algorithm } from "../types";

export const InterpolationSearch: Algorithm = {
  id: "InterpolationSearch",
  name: "Interpolation Search",
  category: "Searching",
  description: "An improvement over binary search for uniformly distributed sorted data, estimating position based on value.",
  code: {
    java: `class Solution {
    public int interpolationSearch(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        while (low <= high && target >= nums[low] && target <= nums[high]) {
            if (low == high) {
                if (nums[low] == target) return low;
                return -1;
            }
            int pos = low + (int)(((double)(high - low) / (nums[high] - nums[low])) * (target - nums[low]));
            if (nums[pos] == target) return pos;
            if (nums[pos] < target) low = pos + 1;
            else high = pos - 1;
        }
        return -1;
    }
}`,
    c: `int interpolationSearch(int* nums, int numsSize, int target) {
    int low = 0, high = numsSize - 1;
    while (low <= high && target >= nums[low] && target <= nums[high]) {
        if (low == high) {
            if (nums[low] == target) return low;
            return -1;
        }
        int pos = low + (((double)(high - low) / (nums[high] - nums[low])) * (target - nums[low]));
        if (nums[pos] == target) return pos;
        if (nums[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}`,
    cpp: `#include <vector>

class Solution {
public:
    int interpolationSearch(std::vector<int>& nums, int target) {
        int low = 0, high = nums.size() - 1;
        while (low <= high && target >= nums[low] && target <= nums[high]) {
            if (low == high) {
                if (nums[low] == target) return low;
                return -1;
            }
            int pos = low + (((double)(high - low) / (nums[high] - nums[low])) * (target - nums[low]));
            if (nums[pos] == target) return pos;
            if (nums[pos] < target) low = pos + 1;
            else high = pos - 1;
        }
        return -1;
    }
};`,
    python: `class Solution:
    def interpolationSearch(self, nums: list[int], target: int) -> int:
        low, high = 0, len(nums) - 1
        while low <= high and nums[low] <= target <= nums[high]:
            if low == high:
                if nums[low] == target:
                    return low
                return -1
            pos = low + int(((high - low) / (nums[high] - nums[low])) * (target - nums[low]))
            if nums[pos] == target:
                return pos
            if nums[pos] < target:
                low = pos + 1
            else:
                high = pos - 1
        return -1`,
    javascript: `var interpolationSearch = function(nums, target) {
    let low = 0, high = nums.length - 1;
    while (low <= high && target >= nums[low] && target <= nums[high]) {
        if (low === high) {
            if (nums[low] === target) return low;
            return -1;
        }
        let pos = low + Math.floor(((high - low) / (nums[high] - nums[low])) * (target - nums[low]));
        if (nums[pos] === target) return pos;
        if (nums[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
};`,
    typescript: `function interpolationSearch(nums: number[], target: number): number {
    let low = 0, high = nums.length - 1;
    while (low <= high && target >= nums[low] && target <= nums[high]) {
        if (low === high) {
            if (nums[low] === target) return low;
            return -1;
        }
        let pos = low + Math.floor(((high - low) / (nums[high] - nums[low])) * (target - nums[low]));
        if (nums[pos] === target) return pos;
        if (nums[pos] < target) low = pos + 1;
        else high = pos - 1;
    }
    return -1;
}`,
    go: `func interpolationSearch(nums []int, target int) int {
    low, high := 0, len(nums)-1
    for low <= high && target >= nums[low] && target <= nums[high] {
        if low == high {
            if nums[low] == target { return low }
            return -1
        }
        pos := low + int((float64(high-low)/float64(nums[high]-nums[low]))*float64(target-nums[low]))
        if nums[pos] == target { return pos }
        if nums[pos] < target { low = pos + 1 } else { high = pos - 1 }
    }
    return -1
}`,
    rust: `impl Solution {
    pub fn interpolation_search(nums: Vec<i32>, target: i32) -> i32 {
        let mut low = 0i32;
        let mut high = (nums.len() as i32) - 1;
        while low <= high && target >= nums[low as usize] && target <= nums[high as usize] {
            if low == high {
                if nums[low as usize] == target { return low; }
                return -1;
            }
            let pos = low + (((high - low) as f64 / (nums[high as usize] - nums[low as usize]) as f64) * (target - nums[low as usize]) as f64) as i32;
            if nums[pos as usize] == target { return pos; }
            if nums[pos as usize] < target { low = pos + 1; }
            else { high = pos - 1; }
        }
        -1
    }
}`,
    csharp: `public class Solution {
    public int InterpolationSearch(int[] nums, int target) {
        int low = 0, high = nums.Length - 1;
        while (low <= high && target >= nums[low] && target <= nums[high]) {
            if (low == high) {
                if (nums[low] == target) return low;
                return -1;
            }
            int pos = low + (int)(((double)(high - low) / (nums[high] - nums[low])) * (target - nums[low]));
            if (nums[pos] == target) return pos;
            if (nums[pos] < target) low = pos + 1;
            else high = pos - 1;
        }
        return -1;
    }
}`,
    kotlin: `class Solution {
    fun interpolationSearch(nums: IntArray, target: Int): Int {
        var low = 0
        var high = nums.size - 1
        while (low <= high && target >= nums[low] && target <= nums[high]) {
            if (low == high) {
                if (nums[low] == target) return low
                return -1
            }
            val pos = low + (((high - low).toDouble() / (nums[high] - nums[low])) * (target - nums[low])).toInt()
            if (nums[pos] == target) return pos
            if (nums[pos] < target) low = pos + 1
            else high = pos - 1
        }
        return -1
    }
}`,
    swift: `class Solution {
    func interpolationSearch(_ nums: [Int], _ target: Int) -> Int {
        var low = 0, high = nums.count - 1
        while low <= high && target >= nums[low] && target <= nums[high] {
            if low == high {
                if nums[low] == target { return low }
                return -1
            }
            let pos = low + Int((Double(high - low) / Double(nums[high] - nums[low])) * Double(target - nums[low]))
            if nums[pos] == target { return pos }
            if nums[pos] < target { low = pos + 1 }
            else { high = pos - 1 }
        }
        return -1
    }
}`,
    php: `class Solution {
    function interpolationSearch($nums, $target) {
        $low = 0; $high = count($nums) - 1;
        while ($low <= $high && $target >= $nums[$low] && $target <= $nums[$high]) {
            if ($low == $high) {
                if ($nums[$low] == $target) return $low;
                return -1;
            }
            $pos = $low + (int)((($high - $low) / ($nums[$high] - $nums[$low])) * ($target - $nums[$low]));
            if ($nums[$pos] == $target) return $pos;
            if ($nums[$pos] < $target) $low = $pos + 1;
            else $high = $pos - 1;
        }
        return -1;
    }
}`,
    ruby: `def interpolation_search(nums, target)
  low, high = 0, nums.length - 1
  while low <= high && target >= nums[low] && target <= nums[high]
    return low if low == high && nums[low] == target
    return -1 if low == high
    pos = low + (((high - low).to_f / (nums[high] - nums[low])) * (target - nums[low])).floor
    return pos if nums[pos] == target
    if nums[pos] < target
      low = pos + 1
    else
      high = pos - 1
    end
  end
  -1
end`,
    scala: `object Solution {
    def interpolationSearch(nums: Array[Int], target: Int): Int = {
        var low = 0; var high = nums.length - 1
        while (low <= high && target >= nums(low) && target <= nums(high)) {
            if (low == high) {
                if (nums(low) == target) return low
                return -1
            }
            val pos = low + (((high - low).toDouble / (nums(high) - nums(low))) * (target - nums(low))).toInt
            if (nums(pos) == target) return pos
            if (nums(pos) < target) low = pos + 1
            else high = pos - 1
        }
        -1
    }
}`,
    dart: `class Solution {
  int interpolationSearch(List<int> nums, int target) {
    int low = 0, high = nums.length - 1;
    while (low <= high && target >= nums[low] && target <= nums[high]) {
      if (low == high) {
        if (nums[low] == target) return low;
        return -1;
      }
      int pos = low + (((high - low) / (nums[high] - nums[low])) * (target - nums[low])).floor();
      if (nums[pos] == target) return pos;
      if (nums[pos] < target) low = pos + 1;
      else high = pos - 1;
    }
    return -1;
  }
}`,
    lua: `function interpolationSearch(nums, target)
    local low, high = 1, #nums
    while low <= high and target >= nums[low] and target <= nums[high] do
        if low == high then
            if nums[low] == target then return low - 1 end
            return -1
        end
        local pos = low + math.floor(((high - low) / (nums[high] - nums[low])) * (target - nums[low]))
        if nums[pos] == target then return pos - 1 end
        if nums[pos] < target then low = pos + 1
        else high = pos - 1 end
    end
    return -1
end`,
    perl: `sub interpolation_search {
    my ($nums, $target) = @_;
    my ($low, $high) = (0, $#$nums);
    while ($low <= $high && $target >= $nums->[$low] && $target <= $nums->[$high]) {
        return $low if $low == $high && $nums->[$low] == $target;
        return -1 if $low == $high;
        my $pos = $low + int((($high - $low) / ($nums->[$high] - $nums->[$low])) * ($target - $nums->[$low]));
        return $pos if $nums->[$pos] == $target;
        if ($nums->[$pos] < $target) { $low = $pos + 1; }
        else { $high = $pos - 1; }
    }
    return -1;
}`,
    r: `interpolation_search <- function(nums, target) {
    low <- 1; high <- length(nums)
    while (low <= high && target >= nums[low] && target <= nums[high]) {
        if (low == high) {
            if (nums[low] == target) return(low - 1)
            return(-1)
        }
        pos <- low + floor(((high - low) / (nums[high] - nums[low])) * (target - nums[low]))
        if (nums[pos] == target) return(pos - 1)
        if (nums[pos] < target) { low <- pos + 1 }
        else { high <- pos - 1 }
    }
    return(-1)
}`
  }
};
