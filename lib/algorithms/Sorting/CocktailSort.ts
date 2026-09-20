import { Algorithm } from "../types";

export const CocktailSort: Algorithm = {
  id: "CocktailSort",
  name: "Cocktail Sort",
  category: "Sorting",
  description: "Variation of bubble sort that traverses the list bidirectionally in both directions alternatively.",
  code: {
    java: `class Solution {
    public int[] sortArray(int[] nums) {
        boolean swapped = true;
        int start = 0;
        int end = nums.length - 1;

        while (swapped) {
            swapped = false;
            for (int i = start; i < end; ++i) {
                if (nums[i] > nums[i + 1]) {
                    int temp = nums[i];
                    nums[i] = nums[i + 1];
                    nums[i + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
            swapped = false;
            end--;

            for (int i = end - 1; i >= start; --i) {
                if (nums[i] > nums[i + 1]) {
                    int temp = nums[i];
                    nums[i] = nums[i + 1];
                    nums[i + 1] = temp;
                    swapped = true;
                }
            }
            start++;
        }
        return nums;
    }
}`,
    c: `void cocktailSort(int* nums, int numsSize) {
    int swapped = 1;
    int start = 0, end = numsSize - 1;

    while (swapped) {
        swapped = 0;
        for (int i = start; i < end; ++i) {
            if (nums[i] > nums[i + 1]) {
                int temp = nums[i]; nums[i] = nums[i + 1]; nums[i + 1] = temp;
                swapped = 1;
            }
        }
        if (!swapped) break;
        swapped = 0;
        end--;

        for (int i = end - 1; i >= start; --i) {
            if (nums[i] > nums[i + 1]) {
                int temp = nums[i]; nums[i] = nums[i + 1]; nums[i + 1] = temp;
                swapped = 1;
            }
        }
        start++;
    }
}`,
    cpp: `#include <vector>

class Solution {
public:
    std::vector<int> sortArray(std::vector<int>& nums) {
        bool swapped = true;
        int start = 0, end = nums.size() - 1;

        while (swapped) {
            swapped = false;
            for (int i = start; i < end; ++i) {
                if (nums[i] > nums[i + 1]) {
                    std::swap(nums[i], nums[i + 1]);
                    swapped = true;
                }
            }
            if (!swapped) break;
            swapped = false;
            end--;

            for (int i = end - 1; i >= start; --i) {
                if (nums[i] > nums[i + 1]) {
                    std::swap(nums[i], nums[i + 1]);
                    swapped = true;
                }
            }
            start++;
        }
        return nums;
    }
};`,
    python: `class Solution:
    def sortArray(self, nums: list[int]) -> list[int]:
        swapped = True
        start, end = 0, len(nums) - 1

        while swapped:
            swapped = False
            for i in range(start, end):
                if nums[i] > nums[i + 1]:
                    nums[i], nums[i + 1] = nums[i + 1], nums[i]
                    swapped = True
            if not swapped:
                break
            swapped = False
            end -= 1

            for i in range(end - 1, start - 1, -1):
                if nums[i] > nums[i + 1]:
                    nums[i], nums[i + 1] = nums[i + 1], nums[i]
                    swapped = True
            start += 1
        return nums`,
    javascript: `var sortArray = function(nums) {
    let swapped = true;
    let start = 0, end = nums.length - 1;

    while (swapped) {
        swapped = false;
        for (let i = start; i < end; ++i) {
            if (nums[i] > nums[i + 1]) {
                [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
                swapped = true;
            }
        }
        if (!swapped) break;
        swapped = false;
        end--;

        for (let i = end - 1; i >= start; --i) {
            if (nums[i] > nums[i + 1]) {
                [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
                swapped = true;
            }
        }
        start++;
    }
    return nums;
};`,
    typescript: `function sortArray(nums: number[]): number[] {
    let swapped = true;
    let start = 0, end = nums.length - 1;

    while (swapped) {
        swapped = false;
        for (let i = start; i < end; ++i) {
            if (nums[i] > nums[i + 1]) {
                [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
                swapped = true;
            }
        }
        if (!swapped) break;
        swapped = false;
        end--;

        for (let i = end - 1; i >= start; --i) {
            if (nums[i] > nums[i + 1]) {
                [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
                swapped = true;
            }
        }
        start++;
    }
    return nums;
}`,
    go: `func sortArray(nums []int) []int {
    swapped := true
    start, end := 0, len(nums)-1

    for swapped {
        swapped = false
        for i := start; i < end; i++ {
            if nums[i] > nums[i+1] {
                nums[i], nums[i+1] = nums[i+1], nums[i]
                swapped = true
            }
        }
        if !swapped { break }
        swapped = false
        end--

        for i := end - 1; i >= start; i-- {
            if nums[i] > nums[i+1] {
                nums[i], nums[i+1] = nums[i+1], nums[i]
                swapped = true
            }
        }
        start++
    }
    return nums
}`,
    rust: `impl Solution {
    pub fn sort_array(mut nums: Vec<i32>) -> Vec<i32> {
        if nums.is_empty() { return nums; }
        let mut swapped = true;
        let mut start = 0usize;
        let mut end = nums.len() - 1;

        while swapped {
            swapped = false;
            for i in start..end {
                if nums[i] > nums[i + 1] {
                    nums.swap(i, i + 1);
                    swapped = true;
                }
            }
            if !swapped || end == 0 { break; }
            swapped = false;
            end -= 1;

            for i in (start..end).rev() {
                if nums[i] > nums[i + 1] {
                    nums.swap(i, i + 1);
                    swapped = true;
                }
            }
            start += 1;
        }
        nums
    }
}`,
    csharp: `public class Solution {
    public int[] SortArray(int[] nums) {
        bool swapped = true;
        int start = 0, end = nums.Length - 1;

        while (swapped) {
            swapped = false;
            for (int i = start; i < end; ++i) {
                if (nums[i] > nums[i + 1]) {
                    int temp = nums[i]; nums[i] = nums[i + 1]; nums[i + 1] = temp;
                    swapped = true;
                }
            }
            if (!swapped) break;
            swapped = false;
            end--;

            for (int i = end - 1; i >= start; --i) {
                if (nums[i] > nums[i + 1]) {
                    int temp = nums[i]; nums[i] = nums[i + 1]; nums[i + 1] = temp;
                    swapped = true;
                }
            }
            start++;
        }
        return nums;
    }
}`,
    kotlin: `class Solution {
    fun sortArray(nums: IntArray): IntArray {
        var swapped = true
        var start = 0
        var end = nums.size - 1

        while (swapped) {
            swapped = false
            for (i in start until end) {
                if (nums[i] > nums[i + 1]) {
                    val temp = nums[i]; nums[i] = nums[i + 1]; nums[i + 1] = temp
                    swapped = true
                }
            }
            if (!swapped) break
            swapped = false
            end--

            for (i in end - 1 downTo start) {
                if (nums[i] > nums[i + 1]) {
                    val temp = nums[i]; nums[i] = nums[i + 1]; nums[i + 1] = temp
                    swapped = true
                }
            }
            start++
        }
        return nums
    }
}`,
    swift: `class Solution {
    func sortArray(_ nums: [Int]) -> [Int] {
        var nums = nums
        var swapped = true
        var start = 0
        var end = nums.count - 1

        while swapped {
            swapped = false
            for i in start..<end {
                if nums[i] > nums[i + 1] {
                    nums.swapAt(i, i + 1)
                    swapped = true
                }
            }
            if !swapped { break }
            swapped = false
            end -= 1

            for i in stride(from: end - 1, through: start, by: -1) {
                if nums[i] > nums[i + 1] {
                    nums.swapAt(i, i + 1)
                    swapped = true
                }
            }
            start += 1
        }
        return nums
    }
}`,
    php: `class Solution {
    function sortArray($nums) {
        $swapped = true;
        $start = 0;
        $end = count($nums) - 1;

        while ($swapped) {
            $swapped = false;
            for ($i = $start; $i < $end; ++$i) {
                if ($nums[$i] > $nums[$i + 1]) {
                    $temp = $nums[$i]; $nums[$i] = $nums[$i + 1]; $nums[$i + 1] = $temp;
                    $swapped = true;
                }
            }
            if (!$swapped) break;
            $swapped = false;
            $end--;

            for ($i = $end - 1; $i >= $start; --$i) {
                if ($nums[$i] > $nums[$i + 1]) {
                    $temp = $nums[$i]; $nums[$i] = $nums[$i + 1]; $nums[$i + 1] = $temp;
                    $swapped = true;
                }
            }
            $start++;
        }
        return $nums;
    }
}`,
    ruby: `def sort_array(nums)
  swapped = true
  start_idx = 0
  end_idx = nums.length - 1

  while swapped
    swapped = false
    (start_idx...end_idx).each do |i|
      if nums[i] > nums[i + 1]
        nums[i], nums[i + 1] = nums[i + 1], nums[i]
        swapped = true
      end
    end
    break unless swapped

    swapped = false
    end_idx -= 1

    (end_idx - 1).downto(start_idx) do |i|
      if nums[i] > nums[i + 1]
        nums[i], nums[i + 1] = nums[i + 1], nums[i]
        swapped = true
      end
    end
    start_idx += 1
  end
  nums
end`,
    scala: `object Solution {
    def sortArray(nums: Array[Int]): Array[Int] = {
        var swapped = true
        var start = 0
        var end = nums.length - 1

        while (swapped) {
            swapped = false
            for (i <- start until end) {
                if (nums(i) > nums(i + 1)) {
                    val temp = nums(i); nums(i) = nums(i + 1); nums(i + 1) = temp
                    swapped = true
                }
            }
            if (!swapped) return nums
            swapped = false
            end -= 1

            for (i <- end - 1 to start by -1) {
                if (nums(i) > nums(i + 1)) {
                    val temp = nums(i); nums(i) = nums(i + 1); nums(i + 1) = temp
                    swapped = true
                }
            }
            start += 1
        }
        nums
    }
}`,
    dart: `class Solution {
  List<int> sortArray(List<int> nums) {
    bool swapped = true;
    int start = 0, end = nums.length - 1;

    while (swapped) {
      swapped = false;
      for (int i = start; i < end; ++i) {
        if (nums[i] > nums[i + 1]) {
          int temp = nums[i]; nums[i] = nums[i + 1]; nums[i + 1] = temp;
          swapped = true;
        }
      }
      if (!swapped) break;
      swapped = false;
      end--;

      for (int i = end - 1; i >= start; --i) {
        if (nums[i] > nums[i + 1]) {
          int temp = nums[i]; nums[i] = nums[i + 1]; nums[i + 1] = temp;
          swapped = true;
        }
      }
      start++;
    }
    return nums;
  }
}`,
    lua: `function sortArray(nums)
    local swapped = true
    local start_idx, end_idx = 1, #nums

    while swapped do
        swapped = false
        for i = start_idx, end_idx - 1 do
            if nums[i] > nums[i + 1] then
                nums[i], nums[i + 1] = nums[i + 1], nums[i]
                swapped = true
            end
        end
        if not swapped then break end
        swapped = false
        end_idx = end_idx - 1

        for i = end_idx - 1, start_idx, -1 do
            if nums[i] > nums[i + 1] then
                nums[i], nums[i + 1] = nums[i + 1], nums[i]
                swapped = true
            end
        end
        start_idx = start_idx + 1
    end
    return nums
end`,
    perl: `sub sort_array {
    my ($nums) = @_;
    my $swapped = 1;
    my ($start, $end) = (0, $#$nums);

    while ($swapped) {
        $swapped = 0;
        for my $i ($start .. $end - 1) {
            if ($nums->[$i] > $nums->[$i + 1]) {
                @$nums[$i, $i + 1] = @$nums[$i + 1, $i];
                $swapped = 1;
            }
        }
        last unless $swapped;
        $swapped = 0;
        $end--;

        for (my $i = $end - 1; $i >= $start; $i--) {
            if ($nums->[$i] > $nums->[$i + 1]) {
                @$nums[$i, $i + 1] = @$nums[$i + 1, $i];
                $swapped = 1;
            }
        }
        $start++;
    }
    return $nums;
}`,
    r: `sort_array <- function(nums) {
    swapped <- TRUE
    start_idx <- 1; end_idx <- length(nums)

    while (swapped && start_idx < end_idx) {
        swapped <- FALSE
        for (i in start_idx:(end_idx - 1)) {
            if (nums[i] > nums[i + 1]) {
                temp <- nums[i]; nums[i] <- nums[i + 1]; nums[i + 1] <- temp
                swapped <- TRUE
            }
        }
        if (!swapped) break
        swapped <- FALSE
        end_idx <- end_idx - 1

        for (i in (end_idx - 1):start_idx) {
            if (nums[i] > nums[i + 1]) {
                temp <- nums[i]; nums[i] <- nums[i + 1]; nums[i + 1] <- temp
                swapped <- TRUE
            }
        }
        start_idx <- start_idx + 1
    }
    return(nums)
}`
  }
};
