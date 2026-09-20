import { Algorithm } from "../types";

export const QuickSort: Algorithm = {
  id: "QuickSort",
  name: "Quick Sort",
  category: "Sorting",
  description: "Divide-and-conquer algorithm that selects a pivot element and partitions the array into sub-arrays.",
  code: {
    java: `class Solution {
    public int[] sortArray(int[] nums) {
        quickSort(nums, 0, nums.length - 1);
        return nums;
    }

    private void quickSort(int[] nums, int low, int high) {
        if (low < high) {
            int pivotIdx = partition(nums, low, high);
            quickSort(nums, low, pivotIdx - 1);
            quickSort(nums, pivotIdx + 1, high);
        }
    }

    private int partition(int[] nums, int low, int high) {
        int pivot = nums[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (nums[j] <= pivot) {
                i++;
                int temp = nums[i];
                nums[i] = nums[j];
                nums[j] = temp;
            }
        }
        int temp = nums[i + 1];
        nums[i + 1] = nums[high];
        nums[high] = temp;
        return i + 1;
    }
}`,
    c: `void quickSortRange(int* nums, int low, int high) {
    if (low < high) {
        int pivot = nums[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (nums[j] <= pivot) {
                i++;
                int temp = nums[i];
                nums[i] = nums[j];
                nums[j] = temp;
            }
        }
        int temp = nums[i + 1];
        nums[i + 1] = nums[high];
        nums[high] = temp;
        int p = i + 1;
        quickSortRange(nums, low, p - 1);
        quickSortRange(nums, p + 1, high);
    }
}

void quickSort(int* nums, int numsSize) {
    quickSortRange(nums, 0, numsSize - 1);
}`,
    cpp: `#include <vector>

class Solution {
public:
    std::vector<int> sortArray(std::vector<int>& nums) {
        quickSort(nums, 0, nums.size() - 1);
        return nums;
    }

private:
    void quickSort(std::vector<int>& nums, int low, int high) {
        if (low < high) {
            int p = partition(nums, low, high);
            quickSort(nums, low, p - 1);
            quickSort(nums, p + 1, high);
        }
    }

    int partition(std::vector<int>& nums, int low, int high) {
        int pivot = nums[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (nums[j] <= pivot) {
                i++;
                std::swap(nums[i], nums[j]);
            }
        }
        std::swap(nums[i + 1], nums[high]);
        return i + 1;
    }
};`,
    python: `class Solution:
    def sortArray(self, nums: list[int]) -> list[int]:
        self.quickSort(nums, 0, len(nums) - 1)
        return nums

    def quickSort(self, nums: list[int], low: int, high: int):
        if low < high:
            p = self.partition(nums, low, high)
            self.quickSort(nums, low, p - 1)
            self.quickSort(nums, p + 1, high)

    def partition(self, nums: list[int], low: int, high: int) -> int:
        pivot = nums[high]
        i = low - 1
        for j in range(low, high):
            if nums[j] <= pivot:
                i += 1
                nums[i], nums[j] = nums[j], nums[i]
        nums[i + 1], nums[high] = nums[high], nums[i + 1]
        return i + 1`,
    javascript: `var sortArray = function(nums) {
    quickSort(nums, 0, nums.length - 1);
    return nums;
};

function quickSort(nums, low, high) {
    if (low < high) {
        let p = partition(nums, low, high);
        quickSort(nums, low, p - 1);
        quickSort(nums, p + 1, high);
    }
}

function partition(nums, low, high) {
    let pivot = nums[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (nums[j] <= pivot) {
            i++;
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
    }
    [nums[i + 1], nums[high]] = [nums[high], nums[i + 1]];
    return i + 1;
}`,
    typescript: `function sortArray(nums: number[]): number[] {
    quickSort(nums, 0, nums.length - 1);
    return nums;
}

function quickSort(nums: number[], low: number, high: number): void {
    if (low < high) {
        let p = partition(nums, low, high);
        quickSort(nums, low, p - 1);
        quickSort(nums, p + 1, high);
    }
}

function partition(nums: number[], low: number, high: number): number {
    let pivot = nums[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (nums[j] <= pivot) {
            i++;
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
    }
    [nums[i + 1], nums[high]] = [nums[high], nums[i + 1]];
    return i + 1;
}`,
    go: `func sortArray(nums []int) []int {
    quickSort(nums, 0, len(nums)-1)
    return nums
}

func quickSort(nums []int, low, high int) {
    if low < high {
        p := partition(nums, low, high)
        quickSort(nums, low, p-1)
        quickSort(nums, p+1, high)
    }
}

func partition(nums []int, low, high int) int {
    pivot := nums[high]
    i := low - 1
    for j := low; j < high; j++ {
        if nums[j] <= pivot {
            i++
            nums[i], nums[j] = nums[j], nums[i]
        }
    }
    nums[i+1], nums[high] = nums[high], nums[i+1]
    return i + 1
}`,
    rust: `impl Solution {
    pub fn sort_array(mut nums: Vec<i32>) -> Vec<i32> {
        let len = nums.len();
        if len > 1 {
            Self::quick_sort(&mut nums, 0, len - 1);
        }
        nums
    }

    fn quick_sort(nums: &mut Vec<i32>, low: usize, high: usize) {
        if low < high {
            let p = Self::partition(nums, low, high);
            if p > 0 {
                Self::quick_sort(nums, low, p - 1);
            }
            Self::quick_sort(nums, p + 1, high);
        }
    }

    fn partition(nums: &mut Vec<i32>, low: usize, high: usize) -> usize {
        let pivot = nums[high];
        let mut i = low;
        for j in low..high {
            if nums[j] <= pivot {
                nums.swap(i, j);
                i += 1;
            }
        }
        nums.swap(i, high);
        i
    }
}`,
    csharp: `public class Solution {
    public int[] SortArray(int[] nums) {
        QuickSort(nums, 0, nums.Length - 1);
        return nums;
    }

    private void QuickSort(int[] nums, int low, int high) {
        if (low < high) {
            int p = Partition(nums, low, high);
            QuickSort(nums, low, p - 1);
            QuickSort(nums, p + 1, high);
        }
    }

    private int Partition(int[] nums, int low, int high) {
        int pivot = nums[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (nums[j] <= pivot) {
                i++;
                int temp = nums[i]; nums[i] = nums[j]; nums[j] = temp;
            }
        }
        int temp2 = nums[i + 1]; nums[i + 1] = nums[high]; nums[high] = temp2;
        return i + 1;
    }
}`,
    kotlin: `class Solution {
    fun sortArray(nums: IntArray): IntArray {
        quickSort(nums, 0, nums.size - 1)
        return nums
    }

    private fun quickSort(nums: IntArray, low: Int, high: Int) {
        if (low < high) {
            val p = partition(nums, low, high)
            quickSort(nums, low, p - 1)
            quickSort(nums, p + 1, high)
        }
    }

    private fun partition(nums: IntArray, low: Int, high: Int): Int {
        val pivot = nums[high]
        var i = low - 1
        for (j in low until high) {
            if (nums[j] <= pivot) {
                i++
                val temp = nums[i]; nums[i] = nums[j]; nums[j] = temp
            }
        }
        val temp = nums[i + 1]; nums[i + 1] = nums[high]; nums[high] = temp
        return i + 1
    }
}`,
    swift: `class Solution {
    func sortArray(_ nums: [Int]) -> [Int] {
        var nums = nums
        quickSort(&nums, 0, nums.count - 1)
        return nums
    }

    private func quickSort(_ nums: inout [Int], _ low: Int, _ high: Int) {
        if low < high {
            let p = partition(&nums, low, high)
            quickSort(&nums, low, p - 1)
            quickSort(&nums, p + 1, high)
        }
    }

    private func partition(_ nums: inout [Int], _ low: Int, _ high: Int) -> Int {
        let pivot = nums[high]
        var i = low - 1
        for j in low..<high {
            if nums[j] <= pivot {
                i += 1
                nums.swapAt(i, j)
            }
        }
        nums.swapAt(i + 1, high)
        return i + 1
    }
}`,
    php: `class Solution {
    function sortArray($nums) {
        $this->quickSort($nums, 0, count($nums) - 1);
        return $nums;
    }

    private function quickSort(&$nums, $low, $high) {
        if ($low < $high) {
            $p = $this->partition($nums, $low, $high);
            $this->quickSort($nums, $low, $p - 1);
            $this->quickSort($nums, $p + 1, $high);
        }
    }

    private function partition(&$nums, $low, $high) {
        $pivot = $nums[$high];
        $i = $low - 1;
        for ($j = $low; $j < $high; $j++) {
            if ($nums[$j] <= $pivot) {
                $i++;
                $temp = $nums[$i]; $nums[$i] = $nums[$j]; $nums[$j] = $temp;
            }
        }
        $temp = $nums[$i + 1]; $nums[$i + 1] = $nums[$high]; $nums[$high] = $temp;
        return $i + 1;
    }
}`,
    ruby: `def sort_array(nums)
  quick_sort(nums, 0, nums.length - 1)
  nums
end

def quick_sort(nums, low, high)
  if low < high
    p = partition(nums, low, high)
    quick_sort(nums, low, p - 1)
    quick_sort(nums, p + 1, high)
  end
end

def partition(nums, low, high)
  pivot = nums[high]
  i = low - 1
  (low...high).each do |j|
    if nums[j] <= pivot
      i += 1
      nums[i], nums[j] = nums[j], nums[i]
    end
  end
  nums[i + 1], nums[high] = nums[high], nums[i + 1]
  i + 1
end`,
    scala: `object Solution {
    def sortArray(nums: Array[Int]): Array[Int] = {
        quickSort(nums, 0, nums.length - 1)
        nums
    }

    private def quickSort(nums: Array[Int], low: Int, high: Int): Unit = {
        if (low < high) {
            val p = partition(nums, low, high)
            quickSort(nums, low, p - 1)
            quickSort(nums, p + 1, high)
        }
    }

    private def partition(nums: Array[Int], low: Int, high: Int): Int = {
        val pivot = nums(high)
        var i = low - 1
        for (j <- low until high) {
            if (nums(j) <= pivot) {
                i += 1
                val temp = nums(i); nums(i) = nums(j); nums(j) = temp
            }
        }
        val temp = nums(i + 1); nums(i + 1) = nums(high); nums(high) = temp
        i + 1
    }
}`,
    dart: `class Solution {
  List<int> sortArray(List<int> nums) {
    _quickSort(nums, 0, nums.length - 1);
    return nums;
  }

  void _quickSort(List<int> nums, int low, int high) {
    if (low < high) {
      int p = _partition(nums, low, high);
      _quickSort(nums, low, p - 1);
      _quickSort(nums, p + 1, high);
    }
  }

  int _partition(List<int> nums, int low, int high) {
    int pivot = nums[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
      if (nums[j] <= pivot) {
        i++;
        int temp = nums[i]; nums[i] = nums[j]; nums[j] = temp;
      }
    }
    int temp = nums[i + 1]; nums[i + 1] = nums[high]; nums[high] = temp;
    return i + 1;
  }
}`,
    lua: `function sortArray(nums)
    quickSort(nums, 1, #nums)
    return nums
end

function quickSort(nums, low, high)
    if low < high then
        local p = partition(nums, low, high)
        quickSort(nums, low, p - 1)
        quickSort(nums, p + 1, high)
    end
end

function partition(nums, low, high)
    local pivot = nums[high]
    local i = low - 1
    for j = low, high - 1 do
        if nums[j] <= pivot then
            i = i + 1
            nums[i], nums[j] = nums[j], nums[i]
        end
    end
    nums[i + 1], nums[high] = nums[high], nums[i + 1]
    return i + 1
end`,
    perl: `sub sort_array {
    my ($nums) = @_;
    quick_sort($nums, 0, $#$nums);
    return $nums;
}

sub quick_sort {
    my ($nums, $low, $high) = @_;
    if ($low < $high) {
        my $p = partition($nums, $low, $high);
        quick_sort($nums, $low, $p - 1);
        quick_sort($nums, $p + 1, $high);
    }
}

sub partition {
    my ($nums, $low, $high) = @_;
    my $pivot = $nums->[$high];
    my $i = $low - 1;
    for my $j ($low .. $high - 1) {
        if ($nums->[$j] <= $pivot) {
            $i++;
            @$nums[$i, $j] = @$nums[$j, $i];
        }
    }
    @$nums[$i + 1, $high] = @$nums[$high, $i + 1];
    return $i + 1;
}`,
    r: `sort_array <- function(nums) {
    if (length(nums) <= 1) return(nums)
    quick_sort <- function(arr, low, high) {
        if (low < high) {
            pivot <- arr[high]
            i <- low - 1
            for (j in low:(high - 1)) {
                if (arr[j] <= pivot) {
                    i <- i + 1
                    temp <- arr[i]; arr[i] <- arr[j]; arr[j] <- temp
                }
            }
            temp <- arr[i + 1]; arr[i + 1] <- arr[high]; arr[high] <- temp
            p <- i + 1
            arr <- quick_sort(arr, low, p - 1)
            arr <- quick_sort(arr, p + 1, high)
        }
        return(arr)
    }
    return(quick_sort(nums, 1, length(nums)))
}`
  }
};
