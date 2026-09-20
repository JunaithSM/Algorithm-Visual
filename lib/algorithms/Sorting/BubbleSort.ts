import { Algorithm } from "../types";

export const BubbleSort: Algorithm = {
  id: "BubbleSort",
  name: "Bubble Sort",
  category: "Sorting",
  description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
  code: {
    java: `class Solution {
    public int[] sortArray(int[] nums) {
        int n = nums.length;
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (nums[j] > nums[j + 1]) {
                    int temp = nums[j];
                    nums[j] = nums[j + 1];
                    nums[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
        return nums;
    }
}`,
    c: `void bubbleSort(int* nums, int numsSize) {
    for (int i = 0; i < numsSize - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < numsSize - i - 1; j++) {
            if (nums[j] > nums[j + 1]) {
                int temp = nums[j];
                nums[j] = nums[j + 1];
                nums[j + 1] = temp;
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
}`,
    cpp: `#include <vector>

class Solution {
public:
    std::vector<int> sortArray(std::vector<int>& nums) {
        int n = nums.size();
        for (int i = 0; i < n - 1; i++) {
            bool swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (nums[j] > nums[j + 1]) {
                    std::swap(nums[j], nums[j + 1]);
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
        return nums;
    }
};`,
    python: `class Solution:
    def sortArray(self, nums: list[int]) -> list[int]:
        n = len(nums)
        for i in range(n - 1):
            swapped = False
            for j in range(n - i - 1):
                if nums[j] > nums[j + 1]:
                    nums[j], nums[j + 1] = nums[j + 1], nums[j]
                    swapped = True
            if not swapped:
                break
        return nums`,
    javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function(nums) {
    const n = nums.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (nums[j] > nums[j + 1]) {
                [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return nums;
};`,
    typescript: `function sortArray(nums: number[]): number[] {
    const n = nums.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (nums[j] > nums[j + 1]) {
                [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
    return nums;
}`,
    go: `func sortArray(nums []int) []int {
    n := len(nums)
    for i := 0; i < n-1; i++ {
        swapped := false
        for j := 0; j < n-i-1; j++ {
            if nums[j] > nums[j+1] {
                nums[j], nums[j+1] = nums[j+1], nums[j]
                swapped = true
            }
        }
        if !swapped {
            break
        }
    }
    return nums
}`,
    rust: `impl Solution {
    pub fn sort_array(mut nums: Vec<i32>) -> Vec<i32> {
        let n = nums.len();
        for i in 0..n {
            let mut swapped = false;
            for j in 0..n - i - 1 {
                if nums[j] > nums[j + 1] {
                    nums.swap(j, j + 1);
                    swapped = true;
                }
            }
            if !swapped {
                break;
            }
        }
        nums
    }
}`,
    csharp: `public class Solution {
    public int[] SortArray(int[] nums) {
        int n = nums.Length;
        for (int i = 0; i < n - 1; i++) {
            bool swapped = false;
            for (int j = 0; j < n - i - 1; j++) {
                if (nums[j] > nums[j + 1]) {
                    int temp = nums[j];
                    nums[j] = nums[j + 1];
                    nums[j + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
        return nums;
    }
}`,
    kotlin: `class Solution {
    fun sortArray(nums: IntArray): IntArray {
        val n = nums.size
        for (i in 0 until n - 1) {
            var swapped = false
            for (j in 0 until n - i - 1) {
                if (nums[j] > nums[j + 1]) {
                    val temp = nums[j]
                    nums[j] = nums[j + 1]
                    nums[j + 1] = temp
                    swapped = true
                }
            }
            if (!swapped) break
        }
        return nums
    }
}`,
    swift: `class Solution {
    func sortArray(_ nums: [Int]) -> [Int] {
        var nums = nums
        let n = nums.count
        for i in 0..<(n - 1) {
            var swapped = false
            for j in 0..<(n - i - 1) {
                if nums[j] > nums[j + 1] {
                    nums.swapAt(j, j + 1)
                    swapped = true
                }
            }
            if !swapped { break }
        }
        return nums
    }
}`,
    php: `class Solution {
    function sortArray($nums) {
        $n = count($nums);
        for ($i = 0; $i < $n - 1; $i++) {
            $swapped = false;
            for ($j = 0; $j < $n - $i - 1; $j++) {
                if ($nums[$j] > $nums[$j + 1]) {
                    $temp = $nums[$j];
                    $nums[$j] = $nums[$j + 1];
                    $nums[$j + 1] = $temp;
                    $swapped = true;
                }
            }
            if (!$swapped) break;
        }
        return $nums;
    }
}`,
    ruby: `def sort_array(nums)
  n = nums.length
  (0...n - 1).each do |i|
    swapped = false
    (0...n - i - 1).each do |j|
      if nums[j] > nums[j + 1]
        nums[j], nums[j + 1] = nums[j + 1], nums[j]
        swapped = true
      end
    end
    break unless swapped
  end
  nums
end`,
    scala: `object Solution {
    def sortArray(nums: Array[Int]): Array[Int] = {
        val n = nums.length
        var swapped = true
        var i = 0
        while (i < n - 1 && swapped) {
            swapped = false
            for (j <- 0 until n - i - 1) {
                if (nums(j) > nums(j + 1)) {
                    val temp = nums(j)
                    nums(j) = nums(j + 1)
                    nums(j + 1) = temp
                    swapped = true
                }
            }
            i += 1
        }
        nums
    }
}`,
    dart: `class Solution {
  List<int> sortArray(List<int> nums) {
    int n = nums.length;
    for (int i = 0; i < n - 1; i++) {
      bool swapped = false;
      for (int j = 0; j < n - i - 1; j++) {
        if (nums[j] > nums[j + 1]) {
          int temp = nums[j];
          nums[j] = nums[j + 1];
          nums[j + 1] = temp;
          swapped = true;
        }
      }
      if (!swapped) break;
    }
    return nums;
  }
}`,
    lua: `function sortArray(nums)
    local n = #nums
    for i = 1, n - 1 do
        local swapped = false
        for j = 1, n - i do
            if nums[j] > nums[j + 1] then
                nums[j], nums[j + 1] = nums[j + 1], nums[j]
                swapped = true
            end
        end
        if not swapped then break end
    end
    return nums
end`,
    perl: `sub sort_array {
    my ($nums) = @_;
    my $n = scalar(@$nums);
    for my $i (0 .. $n - 2) {
        my $swapped = 0;
        for my $j (0 .. $n - $i - 2) {
            if ($nums->[$j] > $nums->[$j + 1]) {
                @$nums[$j, $j + 1] = @$nums[$j + 1, $j];
                $swapped = 1;
            }
        }
        last unless $swapped;
    }
    return $nums;
}`,
    r: `sort_array <- function(nums) {
    n <- length(nums)
    if (n <= 1) return(nums)
    for (i in 1:(n - 1)) {
        swapped <- FALSE
        for (j in 1:(n - i)) {
            if (nums[j] > nums[j + 1]) {
                temp <- nums[j]
                nums[j] <- nums[j + 1]
                nums[j + 1] <- temp
                swapped <- TRUE
            }
        }
        if (!swapped) break
    }
    return(nums)
}`
  }
};
