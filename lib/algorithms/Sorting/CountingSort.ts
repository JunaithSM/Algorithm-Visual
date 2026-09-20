import { Algorithm } from "../types";

export const CountingSort: Algorithm = {
  id: "CountingSort",
  name: "Counting Sort",
  category: "Sorting",
  description: "Non-comparison sorting algorithm that counts occurrences of each unique element.",
  code: {
    java: `class Solution {
    public int[] sortArray(int[] nums) {
        if (nums == null || nums.length <= 1) return nums;
        int min = nums[0], max = nums[0];
        for (int num : nums) {
            if (num < min) min = num;
            if (num > max) max = num;
        }
        int[] count = new int[max - min + 1];
        for (int num : nums) count[num - min]++;
        int index = 0;
        for (int i = 0; i < count.length; i++) {
            while (count[i] > 0) {
                nums[index++] = i + min;
                count[i]--;
            }
        }
        return nums;
    }
}`,
    c: `void countingSort(int* nums, int numsSize) {
    if (numsSize <= 1) return;
    int min = nums[0], max = nums[0];
    for (int i = 1; i < numsSize; i++) {
        if (nums[i] < min) min = nums[i];
        if (nums[i] > max) max = nums[i];
    }
    int range = max - min + 1;
    int count[range];
    for (int i = 0; i < range; i++) count[i] = 0;
    for (int i = 0; i < numsSize; i++) count[nums[i] - min]++;
    int idx = 0;
    for (int i = 0; i < range; i++) {
        while (count[i] > 0) {
            nums[idx++] = i + min;
            count[i]--;
        }
    }
}`,
    cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<int> sortArray(std::vector<int>& nums) {
        if (nums.empty()) return nums;
        auto [minIt, maxIt] = std::minmax_element(nums.begin(), nums.end());
        int minVal = *minIt, maxVal = *maxIt;
        std::vector<int> count(maxVal - minVal + 1, 0);
        for (int num : nums) count[num - minVal]++;
        int index = 0;
        for (int i = 0; i < count.size(); i++) {
            while (count[i] > 0) {
                nums[index++] = i + minVal;
                count[i]--;
            }
        }
        return nums;
    }
};`,
    python: `class Solution:
    def sortArray(self, nums: list[int]) -> list[int]:
        if not nums: return nums
        min_val, max_val = min(nums), max(nums)
        count = [0] * (max_val - min_val + 1)
        for num in nums:
            count[num - min_val] += 1
        index = 0
        for i, cnt in enumerate(count):
            for _ in range(cnt):
                nums[index] = i + min_val
                index += 1
        return nums`,
    javascript: `var sortArray = function(nums) {
    if (!nums.length) return nums;
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const count = new Array(max - min + 1).fill(0);
    for (let num of nums) count[num - min]++;
    let idx = 0;
    for (let i = 0; i < count.length; i++) {
        while (count[i] > 0) {
            nums[idx++] = i + min;
            count[i]--;
        }
    }
    return nums;
};`,
    typescript: `function sortArray(nums: number[]): number[] {
    if (!nums.length) return nums;
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const count = new Array(max - min + 1).fill(0);
    for (let num of nums) count[num - min]++;
    let idx = 0;
    for (let i = 0; i < count.length; i++) {
        while (count[i] > 0) {
            nums[idx++] = i + min;
            count[i]--;
        }
    }
    return nums;
}`,
    go: `func sortArray(nums []int) []int {
    if len(nums) <= 1 { return nums }
    minVal, maxVal := nums[0], nums[0]
    for _, num := range nums {
        if num < minVal { minVal = num }
        if num > maxVal { maxVal = num }
    }
    count := make([]int, maxVal-minVal+1)
    for _, num := range nums { count[num-minVal]++ }
    idx := 0
    for i, cnt := range count {
        for cnt > 0 {
            nums[idx] = i + minVal
            idx++
            cnt--
        }
    }
    return nums
}`,
    rust: `impl Solution {
    pub fn sort_array(mut nums: Vec<i32>) -> Vec<i32> {
        if nums.is_empty() { return nums; }
        let min_val = *nums.iter().min().unwrap();
        let max_val = *nums.iter().max().unwrap();
        let mut count = vec![0; (max_val - min_val + 1) as usize];
        for &num in &nums { count[(num - min_val) as usize] += 1; }
        let mut idx = 0;
        for (i, &cnt) in count.iter().enumerate() {
            for _ in 0..cnt {
                nums[idx] = i as i32 + min_val;
                idx += 1;
            }
        }
        nums
    }
}`,
    csharp: `using System.Linq;

public class Solution {
    public int[] SortArray(int[] nums) {
        if (nums.Length <= 1) return nums;
        int min = nums.Min(), max = nums.Max();
        int[] count = new int[max - min + 1];
        foreach (int num in nums) count[num - min]++;
        int idx = 0;
        for (int i = 0; i < count.Length; i++) {
            while (count[i] > 0) {
                nums[idx++] = i + min;
                count[i]--;
            }
        }
        return nums;
    }
}`,
    kotlin: `class Solution {
    fun sortArray(nums: IntArray): IntArray {
        if (nums.isEmpty()) return nums
        val min = nums.minOrNull()!!
        val max = nums.maxOrNull()!!
        val count = IntArray(max - min + 1)
        for (num in nums) count[num - min]++
        var idx = 0
        for (i in count.indices) {
            while (count[i] > 0) {
                nums[idx++] = i + min
                count[i]--
            }
        }
        return nums
    }
}`,
    swift: `class Solution {
    func sortArray(_ nums: [Int]) -> [Int] {
        guard let minVal = nums.min(), let maxVal = nums.max() else { return nums }
        var nums = nums
        var count = Array(repeating: 0, count: maxVal - minVal + 1)
        for num in nums { count[num - minVal] += 1 }
        var idx = 0
        for i in 0..<count.count {
            while count[i] > 0 {
                nums[idx] = i + minVal
                idx += 1
                count[i] -= 1
            }
        }
        return nums
    }
}`,
    php: `class Solution {
    function sortArray($nums) {
        if (empty($nums)) return $nums;
        $min = min($nums); $max = max($nums);
        $count = array_fill(0, $max - $min + 1, 0);
        foreach ($nums as $num) $count[$num - $min]++;
        $idx = 0;
        foreach ($count as $i => $cnt) {
            while ($cnt > 0) {
                $nums[$idx++] = $i + $min;
                $cnt--;
            }
        }
        return $nums;
    }
}`,
    ruby: `def sort_array(nums)
  return nums if nums.empty?
  min_val, max_val = nums.min, nums.max
  count = Array.new(max_val - min_val + 1, 0)
  nums.each { |num| count[num - min_val] += 1 }
  idx = 0
  count.each_with_index do |cnt, i|
    cnt.times do
      nums[idx] = i + min_val
      idx += 1
    end
  end
  nums
end`,
    scala: `object Solution {
    def sortArray(nums: Array[Int]): Array[Int] = {
        if (nums.isEmpty) return nums
        val minVal = nums.min; val maxVal = nums.max
        val count = new Array[Int](maxVal - minVal + 1)
        for (num <- nums) count(num - minVal) += 1
        var idx = 0
        for (i <- count.indices) {
            while (count(i) > 0) {
                nums(idx) = i + minVal
                idx += 1
                count(i) -= 1
            }
        }
        nums
    }
}`,
    dart: `import 'dart:math';

class Solution {
  List<int> sortArray(List<int> nums) {
    if (nums.isEmpty) return nums;
    int minVal = nums.reduce(min);
    int maxVal = nums.reduce(max);
    List<int> count = List.filled(maxVal - minVal + 1, 0);
    for (int num in nums) count[num - minVal]++;
    int idx = 0;
    for (int i = 0; i < count.length; i++) {
      while (count[i] > 0) {
        nums[idx++] = i + minVal;
        count[i]--;
      }
    }
    return nums;
  }
}`,
    lua: `function sortArray(nums)
    if #nums == 0 then return nums end
    local minVal, maxVal = nums[1], nums[1]
    for i = 2, #nums do
        if nums[i] < minVal then minVal = nums[i] end
        if nums[i] > maxVal then maxVal = nums[i] end
    end
    local count = {}
    for i = 1, maxVal - minVal + 1 do count[i] = 0 end
    for _, num in ipairs(nums) do count[num - minVal + 1] = count[num - minVal + 1] + 1 end
    local idx = 1
    for i, cnt in ipairs(count) do
        while cnt > 0 do
            nums[idx] = i + minVal - 1
            idx = idx + 1
            cnt = cnt - 1
        end
    end
    return nums
end`,
    perl: `sub sort_array {
    my ($nums) = @_;
    return $nums if scalar(@$nums) <= 1;
    my ($min, $max) = ($nums->[0], $nums->[0]);
    foreach (@$nums) { $min = $_ if $_ < $min; $max = $_ if $_ > $max; }
    my @count = (0) x ($max - $min + 1);
    foreach (@$nums) { $count[$_ - $min]++; }
    my $idx = 0;
    for my $i (0 .. $#count) {
        while ($count[$i] > 0) {
            $nums->[$idx++] = $i + $min;
            $count[$i]--;
        }
    }
    return $nums;
}`,
    r: `sort_array <- function(nums) {
    if (length(nums) <= 1) return(nums)
    min_val <- min(nums); max_val <- max(nums)
    count <- integer(max_val - min_val + 1)
    for (num in nums) count[num - min_val + 1] <- count[num - min_val + 1] + 1
    idx <- 1
    for (i in seq_along(count)) {
        while (count[i] > 0) {
            nums[idx] <- i + min_val - 1
            idx <- idx + 1
            count[i] <- count[i] - 1
        }
    }
    return(nums)
}`
  }
};
