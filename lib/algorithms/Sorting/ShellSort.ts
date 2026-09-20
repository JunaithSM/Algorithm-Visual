import { Algorithm } from "../types";

export const ShellSort: Algorithm = {
  id: "ShellSort",
  name: "Shell Sort",
  category: "Sorting",
  description: "Generalization of insertion sort that allows exchanges of items that are far apart using shrinking gaps.",
  code: {
    java: `class Solution {
    public int[] sortArray(int[] nums) {
        int n = nums.length;
        for (int gap = n / 2; gap > 0; gap /= 2) {
            for (int i = gap; i < n; i++) {
                int temp = nums[i];
                int j = i;
                while (j >= gap && nums[j - gap] > temp) {
                    nums[j] = nums[j - gap];
                    j -= gap;
                }
                nums[j] = temp;
            }
        }
        return nums;
    }
}`,
    c: `void shellSort(int* nums, int numsSize) {
    for (int gap = numsSize / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < numsSize; i++) {
            int temp = nums[i];
            int j = i;
            while (j >= gap && nums[j - gap] > temp) {
                nums[j] = nums[j - gap];
                j -= gap;
            }
            nums[j] = temp;
        }
    }
}`,
    cpp: `#include <vector>

class Solution {
public:
    std::vector<int> sortArray(std::vector<int>& nums) {
        int n = nums.size();
        for (int gap = n / 2; gap > 0; gap /= 2) {
            for (int i = gap; i < n; i++) {
                int temp = nums[i];
                int j = i;
                while (j >= gap && nums[j - gap] > temp) {
                    nums[j] = nums[j - gap];
                    j -= gap;
                }
                nums[j] = temp;
            }
        }
        return nums;
    }
};`,
    python: `class Solution:
    def sortArray(self, nums: list[int]) -> list[int]:
        n = len(nums)
        gap = n // 2
        while gap > 0:
            for i in range(gap, n):
                temp = nums[i]
                j = i
                while j >= gap and nums[j - gap] > temp:
                    nums[j] = nums[j - gap]
                    j -= gap
                nums[j] = temp
            gap //= 2
        return nums`,
    javascript: `var sortArray = function(nums) {
    const n = nums.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = nums[i];
            let j = i;
            while (j >= gap && nums[j - gap] > temp) {
                nums[j] = nums[j - gap];
                j -= gap;
            }
            nums[j] = temp;
        }
    }
    return nums;
};`,
    typescript: `function sortArray(nums: number[]): number[] {
    const n = nums.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = nums[i];
            let j = i;
            while (j >= gap && nums[j - gap] > temp) {
                nums[j] = nums[j - gap];
                j -= gap;
            }
            nums[j] = temp;
        }
    }
    return nums;
}`,
    go: `func sortArray(nums []int) []int {
    n := len(nums)
    for gap := n / 2; gap > 0; gap /= 2 {
        for i := gap; i < n; i++ {
            temp := nums[i]
            j := i
            for j >= gap && nums[j-gap] > temp {
                nums[j] = nums[j-gap]
                j -= gap
            }
            nums[j] = temp
        }
    }
    return nums
}`,
    rust: `impl Solution {
    pub fn sort_array(mut nums: Vec<i32>) -> Vec<i32> {
        let n = nums.len();
        let mut gap = n / 2;
        while gap > 0 {
            for i in gap..n {
                let temp = nums[i];
                let mut j = i;
                while j >= gap && nums[j - gap] > temp {
                    nums[j] = nums[j - gap];
                    j -= gap;
                }
                nums[j] = temp;
            }
            gap /= 2;
        }
        nums
    }
}`,
    csharp: `public class Solution {
    public int[] SortArray(int[] nums) {
        int n = nums.Length;
        for (int gap = n / 2; gap > 0; gap /= 2) {
            for (int i = gap; i < n; i++) {
                int temp = nums[i];
                int j = i;
                while (j >= gap && nums[j - gap] > temp) {
                    nums[j] = nums[j - gap];
                    j -= gap;
                }
                nums[j] = temp;
            }
        }
        return nums;
    }
}`,
    kotlin: `class Solution {
    fun sortArray(nums: IntArray): IntArray {
        val n = nums.size
        var gap = n / 2
        while (gap > 0) {
            for (i in gap until n) {
                val temp = nums[i]
                var j = i
                while (j >= gap && nums[j - gap] > temp) {
                    nums[j] = nums[j - gap]
                    j -= gap
                }
                nums[j] = temp
            }
            gap /= 2
        }
        return nums
    }
}`,
    swift: `class Solution {
    func sortArray(_ nums: [Int]) -> [Int] {
        var nums = nums
        let n = nums.count
        var gap = n / 2
        while gap > 0 {
            for i in gap..<n {
                let temp = nums[i]
                var j = i
                while j >= gap && nums[j - gap] > temp {
                    nums[j] = nums[j - gap]
                    j -= gap
                }
                nums[j] = temp
            }
            gap /= 2
        }
        return nums
    }
}`,
    php: `class Solution {
    function sortArray($nums) {
        $n = count($nums);
        for ($gap = intdiv($n, 2); $gap > 0; $gap = intdiv($gap, 2)) {
            for ($i = $gap; $i < $n; $i++) {
                $temp = $nums[$i];
                $j = $i;
                while ($j >= $gap && $nums[$j - $gap] > $temp) {
                    $nums[$j] = $nums[$j - $gap];
                    $j -= $gap;
                }
                $nums[$j] = $temp;
            }
        }
        return $nums;
    }
}`,
    ruby: `def sort_array(nums)
  n = nums.length
  gap = n / 2
  while gap > 0
    (gap...n).each do |i|
      temp = nums[i]
      j = i
      while j >= gap && nums[j - gap] > temp
        nums[j] = nums[j - gap]
        j -= gap
      end
      nums[j] = temp
    end
    gap /= 2
  end
  nums
end`,
    scala: `object Solution {
    def sortArray(nums: Array[Int]): Array[Int] = {
        val n = nums.length
        var gap = n / 2
        while (gap > 0) {
            for (i <- gap until n) {
                val temp = nums(i)
                var j = i
                while (j >= gap && nums(j - gap) > temp) {
                    nums(j) = nums(j - gap)
                    j -= gap
                }
                nums(j) = temp
            }
            gap /= 2
        }
        nums
    }
}`,
    dart: `class Solution {
  List<int> sortArray(List<int> nums) {
    int n = nums.length;
    for (int gap = n ~/ 2; gap > 0; gap ~/= 2) {
      for (int i = gap; i < n; i++) {
        int temp = nums[i];
        int j = i;
        while (j >= gap && nums[j - gap] > temp) {
          nums[j] = nums[j - gap];
          j -= gap;
        }
        nums[j] = temp;
      }
    }
    return nums;
  }
}`,
    lua: `function sortArray(nums)
    local n = #nums
    local gap = math.floor(n / 2)
    while gap > 0 do
        for i = gap + 1, n do
            local temp = nums[i]
            local j = i
            while j > gap and nums[j - gap] > temp do
                nums[j] = nums[j - gap]
                j = j - gap
            end
            nums[j] = temp
        end
        gap = math.floor(gap / 2)
    end
    return nums
end`,
    perl: `sub sort_array {
    my ($nums) = @_;
    my $n = scalar(@$nums);
    for (my $gap = int($n / 2); $gap > 0; $gap = int($gap / 2)) {
        for my $i ($gap .. $n - 1) {
            my $temp = $nums->[$i];
            my $j = $i;
            while ($j >= $gap && $nums->[$j - $gap] > $temp) {
                $nums->[$j] = $nums->[$j - $gap];
                $j -= $gap;
            }
            $nums->[$j] = $temp;
        }
    }
    return $nums;
}`,
    r: `sort_array <- function(nums) {
    n <- length(nums)
    if (n <= 1) return(nums)
    gap <- n %/% 2
    while (gap > 0) {
        for (i in (gap + 1):n) {
            temp <- nums[i]
            j <- i
            while (j > gap && nums[j - gap] > temp) {
                nums[j] <- nums[j - gap]
                j <- j - gap
            }
            nums[j] <- temp
        }
        gap <- gap %/% 2
    }
    return(nums)
}`
  }
};
