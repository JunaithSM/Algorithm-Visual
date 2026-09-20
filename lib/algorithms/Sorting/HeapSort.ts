import { Algorithm } from "../types";

export const HeapSort: Algorithm = {
  id: "HeapSort",
  name: "Heap Sort",
  category: "Sorting",
  description: "Comparison-based sorting algorithm that uses a binary heap data structure to sort elements.",
  code: {
    java: `class Solution {
    public int[] sortArray(int[] nums) {
        int n = nums.length;
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(nums, n, i);
        }
        for (int i = n - 1; i > 0; i--) {
            int temp = nums[0];
            nums[0] = nums[i];
            nums[i] = temp;
            heapify(nums, i, 0);
        }
        return nums;
    }

    private void heapify(int[] nums, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && nums[left] > nums[largest]) largest = left;
        if (right < n && nums[right] > nums[largest]) largest = right;

        if (largest != i) {
            int swap = nums[i];
            nums[i] = nums[largest];
            nums[largest] = swap;
            heapify(nums, n, largest);
        }
    }
}`,
    c: `void heapify(int* nums, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && nums[left] > nums[largest]) largest = left;
    if (right < n && nums[right] > nums[largest]) largest = right;

    if (largest != i) {
        int swap = nums[i];
        nums[i] = nums[largest];
        nums[largest] = swap;
        heapify(nums, n, largest);
    }
}

void heapSort(int* nums, int numsSize) {
    for (int i = numsSize / 2 - 1; i >= 0; i--) heapify(nums, numsSize, i);
    for (int i = numsSize - 1; i > 0; i--) {
        int temp = nums[0];
        nums[0] = nums[i];
        nums[i] = temp;
        heapify(nums, i, 0);
    }
}`,
    cpp: `#include <vector>

class Solution {
public:
    std::vector<int> sortArray(std::vector<int>& nums) {
        int n = nums.size();
        for (int i = n / 2 - 1; i >= 0; i--) heapify(nums, n, i);
        for (int i = n - 1; i > 0; i--) {
            std::swap(nums[0], nums[i]);
            heapify(nums, i, 0);
        }
        return nums;
    }

private:
    void heapify(std::vector<int>& nums, int n, int i) {
        int largest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && nums[l] > nums[largest]) largest = l;
        if (r < n && nums[r] > nums[largest]) largest = r;
        if (largest != i) {
            std::swap(nums[i], nums[largest]);
            heapify(nums, n, largest);
        }
    }
};`,
    python: `class Solution:
    def sortArray(self, nums: list[int]) -> list[int]:
        n = len(nums)
        for i in range(n // 2 - 1, -1, -1):
            self.heapify(nums, n, i)
        for i in range(n - 1, 0, -1):
            nums[0], nums[i] = nums[i], nums[0]
            self.heapify(nums, i, 0)
        return nums

    def heapify(self, nums: list[int], n: int, i: int):
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        if left < n and nums[left] > nums[largest]:
            largest = left
        if right < n and nums[right] > nums[largest]:
            largest = right
        if largest != i:
            nums[i], nums[largest] = nums[largest], nums[i]
            self.heapify(nums, n, largest)`,
    javascript: `var sortArray = function(nums) {
    const n = nums.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(nums, n, i);
    for (let i = n - 1; i > 0; i--) {
        [nums[0], nums[i]] = [nums[i], nums[0]];
        heapify(nums, i, 0);
    }
    return nums;
};

function heapify(nums, n, i) {
    let largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && nums[l] > nums[largest]) largest = l;
    if (r < n && nums[r] > nums[largest]) largest = r;
    if (largest !== i) {
        [nums[i], nums[largest]] = [nums[largest], nums[i]];
        heapify(nums, n, largest);
    }
}`,
    typescript: `function sortArray(nums: number[]): number[] {
    const n = nums.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(nums, n, i);
    for (let i = n - 1; i > 0; i--) {
        [nums[0], nums[i]] = [nums[i], nums[0]];
        heapify(nums, i, 0);
    }
    return nums;
}

function heapify(nums: number[], n: number, i: number): void {
    let largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && nums[l] > nums[largest]) largest = l;
    if (r < n && nums[r] > nums[largest]) largest = r;
    if (largest !== i) {
        [nums[i], nums[largest]] = [nums[largest], nums[i]];
        heapify(nums, n, largest);
    }
}`,
    go: `func sortArray(nums []int) []int {
    n := len(nums)
    for i := n/2 - 1; i >= 0; i-- {
        heapify(nums, n, i)
    }
    for i := n - 1; i > 0; i-- {
        nums[0], nums[i] = nums[i], nums[0]
        heapify(nums, i, 0)
    }
    return nums
}

func heapify(nums []int, n, i int) {
    largest := i
    l, r := 2*i+1, 2*i+2
    if l < n && nums[l] > nums[largest] { largest = l }
    if r < n && nums[r] > nums[largest] { largest = r }
    if largest != i {
        nums[i], nums[largest] = nums[largest], nums[i]
        heapify(nums, n, largest)
    }
}`,
    rust: `impl Solution {
    pub fn sort_array(mut nums: Vec<i32>) -> Vec<i32> {
        let n = nums.len();
        if n <= 1 { return nums; }
        for i in (0..n / 2).rev() {
            Self::heapify(&mut nums, n, i);
        }
        for i in (1..n).rev() {
            nums.swap(0, i);
            Self::heapify(&mut nums, i, 0);
        }
        nums
    }

    fn heapify(nums: &mut Vec<i32>, n: usize, i: usize) {
        let mut largest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;
        if l < n && nums[l] > nums[largest] { largest = l; }
        if r < n && nums[r] > nums[largest] { largest = r; }
        if largest != i {
            nums.swap(i, largest);
            Self::heapify(nums, n, largest);
        }
    }
}`,
    csharp: `public class Solution {
    public int[] SortArray(int[] nums) {
        int n = nums.Length;
        for (int i = n / 2 - 1; i >= 0; i--) Heapify(nums, n, i);
        for (int i = n - 1; i > 0; i--) {
            int temp = nums[0]; nums[0] = nums[i]; nums[i] = temp;
            Heapify(nums, i, 0);
        }
        return nums;
    }

    private void Heapify(int[] nums, int n, int i) {
        int largest = i, l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && nums[l] > nums[largest]) largest = l;
        if (r < n && nums[r] > nums[largest]) largest = r;
        if (largest != i) {
            int swap = nums[i]; nums[i] = nums[largest]; nums[largest] = swap;
            Heapify(nums, n, largest);
        }
    }
}`,
    kotlin: `class Solution {
    fun sortArray(nums: IntArray): IntArray {
        val n = nums.size
        for (i in n / 2 - 1 downTo 0) heapify(nums, n, i)
        for (i in n - 1 downTo 1) {
            val temp = nums[0]; nums[0] = nums[i]; nums[i] = temp
            heapify(nums, i, 0)
        }
        return nums
    }

    private fun heapify(nums: IntArray, n: Int, i: Int) {
        var largest = i
        val l = 2 * i + 1
        val r = 2 * i + 2
        if (l < n && nums[l] > nums[largest]) largest = l
        if (r < n && nums[r] > nums[largest]) largest = r
        if (largest != i) {
            val temp = nums[i]; nums[i] = nums[largest]; nums[largest] = temp
            heapify(nums, n, largest)
        }
    }
}`,
    swift: `class Solution {
    func sortArray(_ nums: [Int]) -> [Int] {
        var nums = nums
        let n = nums.count
        for i in stride(from: n / 2 - 1, through: 0, by: -1) {
            heapify(&nums, n, i)
        }
        for i in stride(from: n - 1, to: 0, by: -1) {
            nums.swapAt(0, i)
            heapify(&nums, i, 0)
        }
        return nums
    }

    private func heapify(_ nums: inout [Int], _ n: Int, _ i: Int) {
        var largest = i
        let l = 2 * i + 1
        let r = 2 * i + 2
        if l < n && nums[l] > nums[largest] { largest = l }
        if r < n && nums[r] > nums[largest] { largest = r }
        if largest != i {
            nums.swapAt(i, largest)
            heapify(&nums, n, largest)
        }
    }
}`,
    php: `class Solution {
    function sortArray($nums) {
        $n = count($nums);
        for ($i = (int)($n / 2) - 1; $i >= 0; $i--) $this->heapify($nums, $n, $i);
        for ($i = $n - 1; $i > 0; $i--) {
            $temp = $nums[0]; $nums[0] = $nums[$i]; $nums[$i] = $temp;
            $this->heapify($nums, $i, 0);
        }
        return $nums;
    }

    private function heapify(&$nums, $n, $i) {
        $largest = $i; $l = 2 * $i + 1; $r = 2 * $i + 2;
        if ($l < $n && $nums[$l] > $nums[$largest]) $largest = $l;
        if ($r < $n && $nums[$r] > $nums[$largest]) $largest = $r;
        if ($largest != $i) {
            $temp = $nums[$i]; $nums[$i] = $nums[$largest]; $nums[$largest] = $temp;
            $this->heapify($nums, $n, $largest);
        }
    }
}`,
    ruby: `def sort_array(nums)
  n = nums.length
  (n / 2 - 1).downto(0) { |i| heapify(nums, n, i) }
  (n - 1).downto(1) do |i|
    nums[0], nums[i] = nums[i], nums[0]
    heapify(nums, i, 0)
  end
  nums
end

def heapify(nums, n, i)
  largest = i
  l, r = 2 * i + 1, 2 * i + 2
  largest = l if l < n && nums[l] > nums[largest]
  largest = r if r < n && nums[r] > nums[largest]
  if largest != i
    nums[i], nums[largest] = nums[largest], nums[i]
    heapify(nums, n, largest)
  end
end`,
    scala: `object Solution {
    def sortArray(nums: Array[Int]): Array[Int] = {
        val n = nums.length
        for (i <- n / 2 - 1 to 0 by -1) heapify(nums, n, i)
        for (i <- n - 1 to 1 by -1) {
            val temp = nums(0); nums(0) = nums(i); nums(i) = temp
            heapify(nums, i, 0)
        }
        nums
    }

    private def heapify(nums: Array[Int], n: Int, i: Int): Unit = {
        var largest = i
        val l = 2 * i + 1
        val r = 2 * i + 2
        if (l < n && nums(l) > nums(largest)) largest = l
        if (r < n && nums(r) > nums(largest)) largest = r
        if (largest != i) {
            val temp = nums(i); nums(i) = nums(largest); nums(largest) = temp
            heapify(nums, n, largest)
        }
    }
}`,
    dart: `class Solution {
  List<int> sortArray(List<int> nums) {
    int n = nums.length;
    for (int i = n ~/ 2 - 1; i >= 0; i--) _heapify(nums, n, i);
    for (int i = n - 1; i > 0; i--) {
      int temp = nums[0]; nums[0] = nums[i]; nums[i] = temp;
      _heapify(nums, i, 0);
    }
    return nums;
  }

  void _heapify(List<int> nums, int n, int i) {
    int largest = i, l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && nums[l] > nums[largest]) largest = l;
    if (r < n && nums[r] > nums[largest]) largest = r;
    if (largest != i) {
      int temp = nums[i]; nums[i] = nums[largest]; nums[largest] = temp;
      _heapify(nums, n, largest);
    }
  }
}`,
    lua: `function sortArray(nums)
    local n = #nums
    for i = math.floor(n / 2), 1, -1 do heapify(nums, n, i) end
    for i = n, 2, -1 do
        nums[1], nums[i] = nums[i], nums[1]
        heapify(nums, i - 1, 1)
    end
    return nums
end

function heapify(nums, n, i)
    local largest = i
    local l, r = 2 * i, 2 * i + 1
    if l <= n and nums[l] > nums[largest] then largest = l end
    if r <= n and nums[r] > nums[largest] then largest = r end
    if largest ~= i then
        nums[i], nums[largest] = nums[largest], nums[i]
        heapify(nums, n, largest)
    end
end`,
    perl: `sub sort_array {
    my ($nums) = @_;
    my $n = scalar(@$nums);
    for (my $i = int($n / 2) - 1; $i >= 0; $i--) { heapify($nums, $n, $i); }
    for (my $i = $n - 1; $i > 0; $i--) {
        @$nums[0, $i] = @$nums[$i, 0];
        heapify($nums, $i, 0);
    }
    return $nums;
}

sub heapify {
    my ($nums, $n, $i) = @_;
    my $largest = $i;
    my ($l, $r) = (2 * $i + 1, 2 * $i + 2);
    $largest = $l if $l < $n && $nums->[$l] > $nums->[$largest];
    $largest = $r if $r < $n && $nums->[$r] > $nums->[$largest];
    if ($largest != $i) {
        @$nums[$i, $largest] = @$nums[$largest, $i];
        heapify($nums, $n, $largest);
    }
}`,
    r: `sort_array <- function(nums) {
    n <- length(nums)
    if (n <= 1) return(nums)
    heapify <- function(arr, size, i) {
        largest <- i
        l <- 2 * i; r <- 2 * i + 1
        if (l <= size && arr[l] > arr[largest]) largest <- l
        if (r <= size && arr[r] > arr[largest]) largest <- r
        if (largest != i) {
            temp <- arr[i]; arr[i] <- arr[largest]; arr[largest] <- temp
            arr <- heapify(arr, size, largest)
        }
        return(arr)
    }
    for (i in floor(n / 2):1) nums <- heapify(nums, n, i)
    for (i in n:2) {
        temp <- nums[1]; nums[1] <- nums[i]; nums[i] <- temp
        nums <- heapify(nums, i - 1, 1)
    }
    return(nums)
}`
  }
};
