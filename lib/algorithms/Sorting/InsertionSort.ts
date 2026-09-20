import { Algorithm } from "../types";

export const InsertionSort: Algorithm = {
  id: "InsertionSort",
  name: "Insertion Sort",
  category: "Sorting",
  description: "Builds the final sorted array one item at a time by repeatedly inserting unsorted elements into their correct position.",
  code: {
    java: `class Solution {
    public int[] sortArray(int[] nums) {
        int n = nums.length;
        for (int i = 1; i < n; i++) {
            int key = nums[i];
            int j = i - 1;
            while (j >= 0 && nums[j] > key) {
                nums[j + 1] = nums[j];
                j--;
            }
            nums[j + 1] = key;
        }
        return nums;
    }
}`,
    c: `void insertionSort(int* nums, int numsSize) {
    for (int i = 1; i < numsSize; i++) {
        int key = nums[i];
        int j = i - 1;
        while (j >= 0 && nums[j] > key) {
            nums[j + 1] = nums[j];
            j--;
        }
        nums[j + 1] = key;
    }
}`,
    cpp: `#include <vector>

class Solution {
public:
    std::vector<int> sortArray(std::vector<int>& nums) {
        int n = nums.size();
        for (int i = 1; i < n; i++) {
            int key = nums[i];
            int j = i - 1;
            while (j >= 0 && nums[j] > key) {
                nums[j + 1] = nums[j];
                j--;
            }
            nums[j + 1] = key;
        }
        return nums;
    }
};`,
    python: `class Solution:
    def sortArray(self, nums: list[int]) -> list[int]:
        for i in range(1, len(nums)):
            key = nums[i]
            j = i - 1
            while j >= 0 and nums[j] > key:
                nums[j + 1] = nums[j]
                j -= 1
            nums[j + 1] = key
        return nums`,
    javascript: `var sortArray = function(nums) {
    for (let i = 1; i < nums.length; i++) {
        let key = nums[i];
        let j = i - 1;
        while (j >= 0 && nums[j] > key) {
            nums[j + 1] = nums[j];
            j--;
        }
        nums[j + 1] = key;
    }
    return nums;
};`,
    typescript: `function sortArray(nums: number[]): number[] {
    for (let i = 1; i < nums.length; i++) {
        let key = nums[i];
        let j = i - 1;
        while (j >= 0 && nums[j] > key) {
            nums[j + 1] = nums[j];
            j--;
        }
        nums[j + 1] = key;
    }
    return nums;
}`,
    go: `func sortArray(nums []int) []int {
    for i := 1; i < len(nums); i++ {
        key := nums[i]
        j := i - 1
        for j >= 0 && nums[j] > key {
            nums[j+1] = nums[j]
            j--
        }
        nums[j+1] = key
    }
    return nums
}`,
    rust: `impl Solution {
    pub fn sort_array(mut nums: Vec<i32>) -> Vec<i32> {
        for i in 1..nums.len() {
            let key = nums[i];
            let mut j = i;
            while j > 0 && nums[j - 1] > key {
                nums[j] = nums[j - 1];
                j -= 1;
            }
            nums[j] = key;
        }
        nums
    }
}`,
    csharp: `public class Solution {
    public int[] SortArray(int[] nums) {
        int n = nums.Length;
        for (int i = 1; i < n; i++) {
            int key = nums[i];
            int j = i - 1;
            while (j >= 0 && nums[j] > key) {
                nums[j + 1] = nums[j];
                j--;
            }
            nums[j + 1] = key;
        }
        return nums;
    }
}`,
    kotlin: `class Solution {
    fun sortArray(nums: IntArray): IntArray {
        for (i in 1 until nums.size) {
            val key = nums[i]
            var j = i - 1
            while (j >= 0 && nums[j] > key) {
                nums[j + 1] = nums[j]
                j--
            }
            nums[j + 1] = key
        }
        return nums
    }
}`,
    swift: `class Solution {
    func sortArray(_ nums: [Int]) -> [Int] {
        var nums = nums
        for i in 1..<nums.count {
            let key = nums[i]
            var j = i - 1
            while j >= 0 && nums[j] > key {
                nums[j + 1] = nums[j]
                j -= 1
            }
            nums[j + 1] = key
        }
        return nums
    }
}`,
    php: `class Solution {
    function sortArray($nums) {
        $n = count($nums);
        for ($i = 1; $i < $n; $i++) {
            $key = $nums[$i];
            $j = $i - 1;
            while ($j >= 0 && $nums[$j] > $key) {
                $nums[$j + 1] = $nums[$j];
                $j--;
            }
            $nums[$j + 1] = $key;
        }
        return $nums;
    }
}`,
    ruby: `def sort_array(nums)
  (1...nums.length).each do |i|
    key = nums[i]
    j = i - 1
    while j >= 0 && nums[j] > key
      nums[j + 1] = nums[j]
      j -= 1
    end
    nums[j + 1] = key
  end
  nums
end`,
    scala: `object Solution {
    def sortArray(nums: Array[Int]): Array[Int] = {
        for (i <- 1 until nums.length) {
            val key = nums(i)
            var j = i - 1
            while (j >= 0 && nums(j) > key) {
                nums(j + 1) = nums(j)
                j -= 1
            }
            nums(j + 1) = key
        }
        nums
    }
}`,
    dart: `class Solution {
  List<int> sortArray(List<int> nums) {
    for (int i = 1; i < nums.length; i++) {
      int key = nums[i];
      int j = i - 1;
      while (j >= 0 && nums[j] > key) {
        nums[j + 1] = nums[j];
        j--;
      }
      nums[j + 1] = key;
    }
    return nums;
  }
}`,
    lua: `function sortArray(nums)
    for i = 2, #nums do
        local key = nums[i]
        local j = i - 1
        while j >= 1 and nums[j] > key do
            nums[j + 1] = nums[j]
            j = j - 1
        end
        nums[j + 1] = key
    end
    return nums
end`,
    perl: `sub sort_array {
    my ($nums) = @_;
    for my $i (1 .. $#$nums) {
        my $key = $nums->[$i];
        my $j = $i - 1;
        while ($j >= 0 && $nums->[$j] > $key) {
            $nums->[$j + 1] = $nums->[$j];
            $j--;
        }
        $nums->[$j + 1] = $key;
    }
    return $nums;
}`,
    r: `sort_array <- function(nums) {
    n <- length(nums)
    if (n <= 1) return(nums)
    for (i in 2:n) {
        key <- nums[i]
        j <- i - 1
        while (j >= 1 && nums[j] > key) {
            nums[j + 1] <- nums[j]
            j <- j - 1
        }
        nums[j + 1] <- key
    }
    return(nums)
}`
  }
};
