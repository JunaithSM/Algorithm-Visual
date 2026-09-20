import { Algorithm } from "../types";

export const SelectionSort: Algorithm = {
  id: "SelectionSort",
  name: "Selection Sort",
  category: "Sorting",
  description: "Divides the list into a sorted and unsorted region, repeatedly selecting the smallest element from the unsorted region.",
  code: {
    java: `class Solution {
    public int[] sortArray(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (nums[j] < nums[minIdx]) {
                    minIdx = j;
                }
            }
            int temp = nums[minIdx];
            nums[minIdx] = nums[i];
            nums[i] = temp;
        }
        return nums;
    }
}`,
    c: `void selectionSort(int* nums, int numsSize) {
    for (int i = 0; i < numsSize - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[j] < nums[minIdx]) minIdx = j;
        }
        int temp = nums[minIdx];
        nums[minIdx] = nums[i];
        nums[i] = temp;
    }
}`,
    cpp: `#include <vector>

class Solution {
public:
    std::vector<int> sortArray(std::vector<int>& nums) {
        int n = nums.size();
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (nums[j] < nums[minIdx]) minIdx = j;
            }
            std::swap(nums[i], nums[minIdx]);
        }
        return nums;
    }
};`,
    python: `class Solution:
    def sortArray(self, nums: list[int]) -> list[int]:
        n = len(nums)
        for i in range(n - 1):
            min_idx = i
            for j in range(i + 1, n):
                if nums[j] < nums[min_idx]:
                    min_idx = j
            nums[i], nums[min_idx] = nums[min_idx], nums[i]
        return nums`,
    javascript: `var sortArray = function(nums) {
    const n = nums.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (nums[j] < nums[minIdx]) minIdx = j;
        }
        [nums[i], nums[minIdx]] = [nums[minIdx], nums[i]];
    }
    return nums;
};`,
    typescript: `function sortArray(nums: number[]): number[] {
    const n = nums.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (nums[j] < nums[minIdx]) minIdx = j;
        }
        [nums[i], nums[minIdx]] = [nums[minIdx], nums[i]];
    }
    return nums;
}`,
    go: `func sortArray(nums []int) []int {
    n := len(nums)
    for i := 0; i < n-1; i++ {
        minIdx := i
        for j := i + 1; j < n; j++ {
            if nums[j] < nums[minIdx] { minIdx = j }
        }
        nums[i], nums[minIdx] = nums[minIdx], nums[i]
    }
    return nums
}`,
    rust: `impl Solution {
    pub fn sort_array(mut nums: Vec<i32>) -> Vec<i32> {
        let n = nums.len();
        for i in 0..n {
            let mut min_idx = i;
            for j in i + 1..n {
                if nums[j] < nums[min_idx] { min_idx = j; }
            }
            nums.swap(i, min_idx);
        }
        nums
    }
}`,
    csharp: `public class Solution {
    public int[] SortArray(int[] nums) {
        int n = nums.Length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (nums[j] < nums[minIdx]) minIdx = j;
            }
            int temp = nums[minIdx];
            nums[minIdx] = nums[i];
            nums[i] = temp;
        }
        return nums;
    }
}`,
    kotlin: `class Solution {
    fun sortArray(nums: IntArray): IntArray {
        val n = nums.size
        for (i in 0 until n - 1) {
            var minIdx = i
            for (j in i + 1 until n) {
                if (nums[j] < nums[minIdx]) minIdx = j
            }
            val temp = nums[minIdx]
            nums[minIdx] = nums[i]
            nums[i] = temp
        }
        return nums
    }
}`,
    swift: `class Solution {
    func sortArray(_ nums: [Int]) -> [Int] {
        var nums = nums
        let n = nums.count
        for i in 0..<(n - 1) {
            var minIdx = i
            for j in (i + 1)..<n {
                if nums[j] < nums[minIdx] { minIdx = j }
            }
            nums.swapAt(i, minIdx)
        }
        return nums
    }
}`,
    php: `class Solution {
    function sortArray($nums) {
        $n = count($nums);
        for ($i = 0; $i < $n - 1; $i++) {
            $minIdx = $i;
            for ($j = $i + 1; $j < $n; $j++) {
                if ($nums[$j] < $nums[$minIdx]) $minIdx = $j;
            }
            $temp = $nums[$minIdx];
            $nums[$minIdx] = $nums[$i];
            $nums[$i] = $temp;
        }
        return $nums;
    }
}`,
    ruby: `def sort_array(nums)
  n = nums.length
  (0...n - 1).each do |i|
    min_idx = i
    (i + 1...n).each do |j|
      min_idx = j if nums[j] < nums[min_idx]
    end
    nums[i], nums[min_idx] = nums[min_idx], nums[i]
  end
  nums
end`,
    scala: `object Solution {
    def sortArray(nums: Array[Int]): Array[Int] = {
        val n = nums.length
        for (i <- 0 until n - 1) {
            var minIdx = i
            for (j <- i + 1 until n) {
                if (nums(j) < nums(minIdx)) minIdx = j
            }
            val temp = nums(minIdx)
            nums(minIdx) = nums(i)
            nums(i) = temp
        }
        nums
    }
}`,
    dart: `class Solution {
  List<int> sortArray(List<int> nums) {
    int n = nums.length;
    for (int i = 0; i < n - 1; i++) {
      int minIdx = i;
      for (int j = i + 1; j < n; j++) {
        if (nums[j] < nums[minIdx]) minIdx = j;
      }
      int temp = nums[minIdx];
      nums[minIdx] = nums[i];
      nums[i] = temp;
    }
    return nums;
  }
}`,
    lua: `function sortArray(nums)
    local n = #nums
    for i = 1, n - 1 do
        local minIdx = i
        for j = i + 1, n do
            if nums[j] < nums[minIdx] then minIdx = j end
        end
        nums[i], nums[minIdx] = nums[minIdx], nums[i]
    end
    return nums
end`,
    perl: `sub sort_array {
    my ($nums) = @_;
    my $n = scalar(@$nums);
    for my $i (0 .. $n - 2) {
        my $min_idx = $i;
        for my $j ($i + 1 .. $n - 1) {
            $min_idx = $j if $nums->[$j] < $nums->[$min_idx];
        }
        @$nums[$i, $min_idx] = @$nums[$min_idx, $i];
    }
    return $nums;
}`,
    r: `sort_array <- function(nums) {
    n <- length(nums)
    if (n <= 1) return(nums)
    for (i in 1:(n - 1)) {
        min_idx <- i
        for (j in (i + 1):n) {
            if (nums[j] < nums[min_idx]) min_idx <- j
        }
        temp <- nums[i]
        nums[i] <- nums[min_idx]
        nums[min_idx] <- temp
    }
    return(nums)
}`
  }
};
