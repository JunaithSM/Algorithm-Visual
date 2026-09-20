import { Algorithm } from "../types";

export const RadixSort: Algorithm = {
  id: "RadixSort",
  name: "Radix Sort",
  category: "Sorting",
  description: "Non-comparison sorting algorithm that processes digits position by position using counting sort as a subroutine.",
  code: {
    java: `import java.util.Arrays;

class Solution {
    public int[] sortArray(int[] nums) {
        if (nums == null || nums.length <= 1) return nums;
        int max = Arrays.stream(nums).max().getAsInt();
        for (int exp = 1; max / exp > 0; exp *= 10) {
            countSortByDigit(nums, exp);
        }
        return nums;
    }

    private void countSortByDigit(int[] nums, int exp) {
        int n = nums.length;
        int[] output = new int[n];
        int[] count = new int[10];

        for (int i = 0; i < n; i++) count[(nums[i] / exp) % 10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        for (int i = n - 1; i >= 0; i--) {
            int digit = (nums[i] / exp) % 10;
            output[count[digit] - 1] = nums[i];
            count[digit]--;
        }
        System.arraycopy(output, 0, nums, 0, n);
    }
}`,
    c: `#include <stdio.h>

void countSortDigit(int* nums, int n, int exp) {
    int output[n];
    int count[10] = {0};
    for (int i = 0; i < n; i++) count[(nums[i] / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        int digit = (nums[i] / exp) % 10;
        output[count[digit] - 1] = nums[i];
        count[digit]--;
    }
    for (int i = 0; i < n; i++) nums[i] = output[i];
}

void radixSort(int* nums, int numsSize) {
    if (numsSize <= 1) return;
    int max = nums[0];
    for (int i = 1; i < numsSize; i++) if (nums[i] > max) max = nums[i];
    for (int exp = 1; max / exp > 0; exp *= 10) {
        countSortDigit(nums, numsSize, exp);
    }
}`,
    cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<int> sortArray(std::vector<int>& nums) {
        if (nums.empty()) return nums;
        int maxVal = *std::max_element(nums.begin(), nums.end());
        for (int exp = 1; maxVal / exp > 0; exp *= 10) {
            countSort(nums, exp);
        }
        return nums;
    }

private:
    void countSort(std::vector<int>& nums, int exp) {
        int n = nums.size();
        std::vector<int> output(n);
        int count[10] = {0};

        for (int i = 0; i < n; i++) count[(nums[i] / exp) % 10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        for (int i = n - 1; i >= 0; i--) {
            int digit = (nums[i] / exp) % 10;
            output[count[digit] - 1] = nums[i];
            count[digit]--;
        }
        nums = output;
    }
};`,
    python: `class Solution:
    def sortArray(self, nums: list[int]) -> list[int]:
        if not nums: return nums
        max_val = max(nums)
        exp = 1
        while max_val // exp > 0:
            nums = self.countSort(nums, exp)
            exp *= 10
        return nums

    def countSort(self, nums: list[int], exp: int) -> list[int]:
        n = len(nums)
        output = [0] * n
        count = [0] * 10
        for num in nums:
            count[(num // exp) % 10] += 1
        for i in range(1, 10):
            count[i] += count[i - 1]
        for i in range(n - 1, -1, -1):
            digit = (nums[i] // exp) % 10
            output[count[digit] - 1] = nums[i]
            count[digit] -= 1
        return output`,
    javascript: `var sortArray = function(nums) {
    if (!nums.length) return nums;
    const max = Math.max(...nums);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        countSort(nums, exp);
    }
    return nums;
};

function countSort(nums, exp) {
    const n = nums.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    for (let num of nums) count[Math.floor(num / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = n - 1; i >= 0; i--) {
        let digit = Math.floor(nums[i] / exp) % 10;
        output[count[digit] - 1] = nums[i];
        count[digit]--;
    }
    for (let i = 0; i < n; i++) nums[i] = output[i];
}`,
    typescript: `function sortArray(nums: number[]): number[] {
    if (!nums.length) return nums;
    const max = Math.max(...nums);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        countSort(nums, exp);
    }
    return nums;
}

function countSort(nums: number[], exp: number): void {
    const n = nums.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    for (let num of nums) count[Math.floor(num / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = n - 1; i >= 0; i--) {
        let digit = Math.floor(nums[i] / exp) % 10;
        output[count[digit] - 1] = nums[i];
        count[digit]--;
    }
    for (let i = 0; i < n; i++) nums[i] = output[i];
}`,
    go: `func sortArray(nums []int) []int {
    if len(nums) <= 1 { return nums }
    maxVal := nums[0]
    for _, num := range nums { if num > maxVal { maxVal = num } }
    for exp := 1; maxVal/exp > 0; exp *= 10 {
        nums = countSort(nums, exp)
    }
    return nums
}

func countSort(nums []int, exp int) []int {
    n := len(nums)
    output := make([]int, n)
    count := [10]int{}
    for _, num := range nums { count[(num/exp)%10]++ }
    for i := 1; i < 10; i++ { count[i] += count[i-1] }
    for i := n - 1; i >= 0; i-- {
        digit := (nums[i] / exp) % 10
        output[count[digit]-1] = nums[i]
        count[digit]--
    }
    return output
}`,
    rust: `impl Solution {
    pub fn sort_array(mut nums: Vec<i32>) -> Vec<i32> {
        if nums.is_empty() { return nums; }
        let max_val = *nums.iter().max().unwrap();
        let mut exp = 1;
        while max_val / exp > 0 {
            nums = Self::count_sort(nums, exp);
            exp *= 10;
        }
        nums
    }

    fn count_sort(nums: Vec<i32>, exp: i32) -> Vec<i32> {
        let n = nums.len();
        let mut output = vec![0; n];
        let mut count = [0; 10];
        for &num in &nums { count[((num / exp) % 10) as usize] += 1; }
        for i in 1..10 { count[i] += count[i - 1]; }
        for i in (0..n).rev() {
            let digit = ((nums[i] / exp) % 10) as usize;
            output[count[digit] - 1] = nums[i];
            count[digit] -= 1;
        }
        output
    }
}`,
    csharp: `using System.Linq;

public class Solution {
    public int[] SortArray(int[] nums) {
        if (nums.Length <= 1) return nums;
        int max = nums.Max();
        for (int exp = 1; max / exp > 0; exp *= 10) {
            CountSort(nums, exp);
        }
        return nums;
    }

    private void CountSort(int[] nums, int exp) {
        int n = nums.Length;
        int[] output = new int[n];
        int[] count = new int[10];
        foreach (int num in nums) count[(num / exp) % 10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        for (int i = n - 1; i >= 0; i--) {
            int digit = (nums[i] / exp) % 10;
            output[count[digit] - 1] = nums[i];
            count[digit]--;
        }
        for (int i = 0; i < n; i++) nums[i] = output[i];
    }
}`,
    kotlin: `class Solution {
    fun sortArray(nums: IntArray): IntArray {
        if (nums.isEmpty()) return nums
        val max = nums.maxOrNull()!!
        var exp = 1
        while (max / exp > 0) {
            countSort(nums, exp)
            exp *= 10
        }
        return nums
    }

    private fun countSort(nums: IntArray, exp: Int) {
        val n = nums.size
        val output = IntArray(n)
        val count = IntArray(10)
        for (num in nums) count[(num / exp) % 10]++
        for (i in 1 until 10) count[i] += count[i - 1]
        for (i in n - 1 downTo 0) {
            val digit = (nums[i] / exp) % 10
            output[count[digit] - 1] = nums[i]
            count[digit]--
        }
        for (i in 0 until n) nums[i] = output[i]
    }
}`,
    swift: `class Solution {
    func sortArray(_ nums: [Int]) -> [Int] {
        guard let maxVal = nums.max() else { return nums }
        var nums = nums
        var exp = 1
        while maxVal / exp > 0 {
            countSort(&nums, exp)
            exp *= 10
        }
        return nums
    }

    private func countSort(_ nums: inout [Int], _ exp: Int) {
        let n = nums.count
        var output = Array(repeating: 0, count: n)
        var count = Array(repeating: 0, count: 10)
        for num in nums { count[(num / exp) % 10] += 1 }
        for i in 1..<10 { count[i] += count[i - 1] }
        for i in stride(from: n - 1, through: 0, by: -1) {
            let digit = (nums[i] / exp) % 10
            output[count[digit] - 1] = nums[i]
            count[digit] -= 1
        }
        nums = output
    }
}`,
    php: `class Solution {
    function sortArray($nums) {
        if (empty($nums)) return $nums;
        $max = max($nums);
        for ($exp = 1; intdiv($max, $exp) > 0; $exp *= 10) {
            $this->countSort($nums, $exp);
        }
        return $nums;
    }

    private function countSort(&$nums, $exp) {
        $n = count($nums);
        $output = array_fill(0, $n, 0);
        $count = array_fill(0, 10, 0);
        foreach ($nums as $num) $count[intdiv($num, $exp) % 10]++;
        for ($i = 1; $i < 10; $i++) $count[$i] += $count[$i - 1];
        for ($i = $n - 1; $i >= 0; $i--) {
            $digit = intdiv($nums[$i], $exp) % 10;
            $output[$count[$digit] - 1] = $nums[$i];
            $count[$digit]--;
        }
        $nums = $output;
    }
}`,
    ruby: `def sort_array(nums)
  return nums if nums.empty?
  max_val = nums.max
  exp = 1
  while max_val / exp > 0
    nums = count_sort(nums, exp)
    exp *= 10
  end
  nums
end

def count_sort(nums, exp)
  n = nums.length
  output = Array.new(n, 0)
  count = Array.new(10, 0)
  nums.each { |num| count[(num / exp) % 10] += 1 }
  (1..9).each { |i| count[i] += count[i - 1] }
  (n - 1).downto(0) do |i|
    digit = (nums[i] / exp) % 10
    output[count[digit] - 1] = nums[i]
    count[digit] -= 1
  end
  output
end`,
    scala: `object Solution {
    def sortArray(nums: Array[Int]): Array[Int] = {
        if (nums.isEmpty) return nums
        val maxVal = nums.max
        var exp = 1
        while (maxVal / exp > 0) {
            countSort(nums, exp)
            exp *= 10
        }
        nums
    }

    private def countSort(nums: Array[Int], exp: Int): Unit = {
        val n = nums.length
        val output = new Array[Int](n)
        val count = new Array[Int](10)
        for (num <- nums) count((num / exp) % 10) += 1
        for (i <- 1 until 10) count(i) += count(i - 1)
        for (i <- n - 1 to 0 by -1) {
            val digit = (nums(i) / exp) % 10
            output(count(digit) - 1) = nums(i)
            count(digit) -= 1
        }
        for (i <- 0 until n) nums(i) = output(i)
    }
}`,
    dart: `class Solution {
  List<int> sortArray(List<int> nums) {
    if (nums.isEmpty) return nums;
    int maxVal = nums.reduce((a, b) => a > b ? a : b);
    for (int exp = 1; maxVal ~/ exp > 0; exp *= 10) {
      _countSort(nums, exp);
    }
    return nums;
  }

  void _countSort(List<int> nums, int exp) {
    int n = nums.length;
    List<int> output = List.filled(n, 0);
    List<int> count = List.filled(10, 0);
    for (int num in nums) count[(num ~/ exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
      int digit = (nums[i] ~/ exp) % 10;
      output[count[digit] - 1] = nums[i];
      count[digit]--;
    }
    for (int i = 0; i < n; i++) nums[i] = output[i];
  }
}`,
    lua: `function sortArray(nums)
    if #nums == 0 then return nums end
    local maxVal = math.max(table.unpack(nums))
    local exp = 1
    while math.floor(maxVal / exp) > 0 do
        countSort(nums, exp)
        exp = exp * 10
    end
    return nums
end

function countSort(nums, exp)
    local n = #nums
    local output = {}
    local count = {}
    for i = 1, 10 do count[i] = 0 end
    for _, num in ipairs(nums) do
        local d = math.floor(num / exp) % 10 + 1
        count[d] = count[d] + 1
    end
    for i = 2, 10 do count[i] = count[i] + count[i - 1] end
    for i = n, 1, -1 do
        local d = math.floor(nums[i] / exp) % 10 + 1
        output[count[d]] = nums[i]
        count[d] = count[d] - 1
    end
    for i = 1, n do nums[i] = output[i] end
end`,
    perl: `sub sort_array {
    my ($nums) = @_;
    return $nums if scalar(@$nums) <= 1;
    my $max = $nums->[0];
    foreach (@$nums) { $max = $_ if $_ > $max; }
    for (my $exp = 1; int($max / $exp) > 0; $exp *= 10) {
        count_sort_digit($nums, $exp);
    }
    return $nums;
}

sub count_sort_digit {
    my ($nums, $exp) = @_;
    my $n = scalar(@$nums);
    my @output = (0) x $n;
    my @count = (0) x 10;
    foreach (@$nums) { $count[int($_ / $exp) % 10]++; }
    for my $i (1 .. 9) { $count[$i] += $count[$i - 1]; }
    for (my $i = $n - 1; $i >= 0; $i--) {
        my $digit = int($nums->[$i] / $exp) % 10;
        $output[--$count[$digit]] = $nums->[$i];
    }
    @$nums = @output;
}`,
    r: `sort_array <- function(nums) {
    if (length(nums) <= 1) return(nums)
    max_val <- max(nums)
    exp <- 1
    while (max_val %/% exp > 0) {
        n <- length(nums)
        output <- integer(n)
        count <- integer(10)
        for (num in nums) {
            d <- (num %/% exp) %% 10 + 1
            count[d] <- count[d] + 1
        }
        for (i in 2:10) count[i] <- count[i] + count[i - 1]
        for (i in n:1) {
            d <- (nums[i] %/% exp) %% 10 + 1
            output[count[d]] <- nums[i]
            count[d] <- count[d] - 1
        }
        nums <- output
        exp <- exp * 10
    }
    return(nums)
}`
  }
};
