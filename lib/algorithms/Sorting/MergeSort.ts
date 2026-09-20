import { Algorithm } from "../types";

export const MergeSort: Algorithm = {
  id: "MergeSort",
  name: "Merge Sort",
  category: "Sorting",
  description: "Efficient, stable divide and conquer algorithm that recursively splits the array and merges sorted halves.",
  code: {
    java: `class Solution {
    public int[] sortArray(int[] nums) {
        mergeSort(nums, 0, nums.length - 1);
        return nums;
    }

    private void mergeSort(int[] nums, int left, int right) {
        if (left >= right) return;
        int mid = left + (right - left) / 2;
        mergeSort(nums, left, mid);
        mergeSort(nums, mid + 1, right);
        merge(nums, left, mid, right);
    }

    private void merge(int[] nums, int left, int mid, int right) {
        int[] temp = new int[right - left + 1];
        int i = left, j = mid + 1, k = 0;

        while (i <= mid && j <= right) {
            if (nums[i] <= nums[j]) temp[k++] = nums[i++];
            else temp[k++] = nums[j++];
        }
        while (i <= mid) temp[k++] = nums[i++];
        while (j <= right) temp[k++] = nums[j++];

        System.arraycopy(temp, 0, nums, left, temp.length);
    }
}`,
    c: `#include <stdlib.h>

void merge(int* nums, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = nums[left + i];
    for (int j = 0; j < n2; j++) R[j] = nums[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) nums[k++] = L[i++];
        else nums[k++] = R[j++];
    }
    while (i < n1) nums[k++] = L[i++];
    while (j < n2) nums[k++] = R[j++];
}

void mergeSortRange(int* nums, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSortRange(nums, left, mid);
        mergeSortRange(nums, mid + 1, right);
        merge(nums, left, mid, right);
    }
}

void mergeSort(int* nums, int numsSize) {
    mergeSortRange(nums, 0, numsSize - 1);
}`,
    cpp: `#include <vector>

class Solution {
public:
    std::vector<int> sortArray(std::vector<int>& nums) {
        mergeSort(nums, 0, nums.size() - 1);
        return nums;
    }

private:
    void mergeSort(std::vector<int>& nums, int left, int right) {
        if (left >= right) return;
        int mid = left + (right - left) / 2;
        mergeSort(nums, left, mid);
        mergeSort(nums, mid + 1, right);
        merge(nums, left, mid, right);
    }

    void merge(std::vector<int>& nums, int left, int mid, int right) {
        std::vector<int> temp(right - left + 1);
        int i = left, j = mid + 1, k = 0;

        while (i <= mid && j <= right) {
            if (nums[i] <= nums[j]) temp[k++] = nums[i++];
            else temp[k++] = nums[j++];
        }
        while (i <= mid) temp[k++] = nums[i++];
        while (j <= right) temp[k++] = nums[j++];

        for (int p = 0; p < temp.size(); p++) {
            nums[left + p] = temp[p];
        }
    }
};`,
    python: `class Solution:
    def sortArray(self, nums: list[int]) -> list[int]:
        if len(nums) <= 1:
            return nums
        mid = len(nums) // 2
        left = self.sortArray(nums[:mid])
        right = self.sortArray(nums[mid:])
        return self.merge(left, right)

    def merge(self, left: list[int], right: list[int]) -> list[int]:
        res = []
        i = j = 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                res.append(left[i]); i += 1
            else:
                res.append(right[j]); j += 1
        res.extend(left[i:])
        res.extend(right[j:])
        return res`,
    javascript: `var sortArray = function(nums) {
    if (nums.length <= 1) return nums;
    const mid = Math.floor(nums.length / 2);
    const left = sortArray(nums.slice(0, mid));
    const right = sortArray(nums.slice(mid));
    return merge(left, right);
};

function merge(left, right) {
    let result = [], i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result.push(left[i++]);
        else result.push(right[j++]);
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    typescript: `function sortArray(nums: number[]): number[] {
    if (nums.length <= 1) return nums;
    const mid = Math.floor(nums.length / 2);
    const left = sortArray(nums.slice(0, mid));
    const right = sortArray(nums.slice(mid));
    return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
    let result: number[] = [], i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) result.push(left[i++]);
        else result.push(right[j++]);
    }
    return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    go: `func sortArray(nums []int) []int {
    if len(nums) <= 1 { return nums }
    mid := len(nums) / 2
    left := sortArray(nums[:mid])
    right := sortArray(nums[mid:])
    return merge(left, right)
}

func merge(left, right []int) []int {
    res := make([]int, 0, len(left)+len(right))
    i, j := 0, 0
    for i < len(left) && j < len(right) {
        if left[i] <= right[j] { res = append(res, left[i]); i++ } else { res = append(res, right[j]); j++ }
    }
    res = append(res, left[i:]...)
    res = append(res, right[j:]...)
    return res
}`,
    rust: `impl Solution {
    pub fn sort_array(nums: Vec<i32>) -> Vec<i32> {
        let len = nums.len();
        if len <= 1 { return nums; }
        let mid = len / 2;
        let left = Self::sort_array(nums[..mid].to_vec());
        let right = Self::sort_array(nums[mid..].to_vec());
        Self::merge(left, right)
    }

    fn merge(left: Vec<i32>, right: Vec<i32>) -> Vec<i32> {
        let mut res = Vec::with_capacity(left.len() + right.len());
        let (mut i, mut j) = (0, 0);
        while i < left.len() && j < right.length {
            if left[i] <= right[j] { res.push(left[i]); i += 1; }
            else { res.push(right[j]); j += 1; }
        }
        res.extend_from_slice(&left[i..]);
        res.extend_from_slice(&right[j..]);
        res
    }
}`,
    csharp: `public class Solution {
    public int[] SortArray(int[] nums) {
        if (nums.Length <= 1) return nums;
        int mid = nums.Length / 2;
        int[] left = new int[mid];
        int[] right = new int[nums.Length - mid];
        Array.Copy(nums, 0, left, 0, mid);
        Array.Copy(nums, mid, right, 0, nums.Length - mid);
        return Merge(SortArray(left), SortArray(right));
    }

    private int[] Merge(int[] left, int[] right) {
        int[] res = new int[left.Length + right.Length];
        int i = 0, j = 0, k = 0;
        while (i < left.Length && j < right.Length) {
            if (left[i] <= right[j]) res[k++] = left[i++];
            else res[k++] = right[j++];
        }
        while (i < left.Length) res[k++] = left[i++];
        while (j < right.Length) res[k++] = right[j++];
        return res;
    }
}`,
    kotlin: `class Solution {
    fun sortArray(nums: IntArray): IntArray {
        if (nums.size <= 1) return nums
        val mid = nums.size / 2
        val left = sortArray(nums.copyOfRange(0, mid))
        val right = sortArray(nums.copyOfRange(mid, nums.size))
        return merge(left, right)
    }

    private fun merge(left: IntArray, right: IntArray): IntArray {
        val res = IntArray(left.size + right.size)
        var i = 0; var j = 0; var k = 0
        while (i < left.size && j < right.size) {
            if (left[i] <= right[j]) res[k++] = left[i++]
            else res[k++] = right[j++]
        }
        while (i < left.size) res[k++] = left[i++]
        while (j < right.size) res[k++] = right[j++]
        return res
    }
}`,
    swift: `class Solution {
    func sortArray(_ nums: [Int]) -> [Int] {
        guard nums.count > 1 else { return nums }
        let mid = nums.count / 2
        let left = sortArray(Array(nums[0..<mid]))
        let right = sortArray(Array(nums[mid...]))
        return merge(left, right)
    }

    private func merge(_ left: [Int], _ right: [Int]) -> [Int] {
        var res = [Int](), i = 0, j = 0
        while i < left.count && j < right.count {
            if left[i] <= right[j] { res.append(left[i]); i += 1 }
            else { res.append(right[j]); j += 1 }
        }
        res.append(contentsOf: left[i...])
        res.append(contentsOf: right[j...])
        return res
    }
}`,
    php: `class Solution {
    function sortArray($nums) {
        if (count($nums) <= 1) return $nums;
        $mid = intdiv(count($nums), 2);
        $left = $this->sortArray(array_slice($nums, 0, $mid));
        $right = $this->sortArray(array_slice($nums, $mid));
        return $this->merge($left, $right);
    }

    private function merge($left, $right) {
        $res = []; $i = 0; $j = 0;
        while ($i < count($left) && $j < count($right)) {
            if ($left[$i] <= $right[$j]) { $res[] = $left[$i++]; }
            else { $res[] = $right[$j++]; }
        }
        while ($i < count($left)) $res[] = $left[$i++];
        while ($j < count($right)) $res[] = $right[$j++];
        return $res;
    }
}`,
    ruby: `def sort_array(nums)
  return nums if nums.length <= 1
  mid = nums.length / 2
  left = sort_array(nums[0...mid])
  right = sort_array(nums[mid..-1])
  merge(left, right)
end

def merge(left, right)
  res = []
  i = j = 0
  while i < left.length && j < right.length
    if left[i] <= right[j]
      res << left[i]; i += 1
    else
      res << right[j]; j += 1
    end
  end
  res.concat(left[i..-1]).concat(right[j..-1])
end`,
    scala: `object Solution {
    def sortArray(nums: Array[Int]): Array[Int] = {
        if (nums.length <= 1) return nums
        val mid = nums.length / 2
        val left = sortArray(nums.take(mid))
        val right = sortArray(nums.drop(mid))
        merge(left, right)
    }

    private def merge(left: Array[Int], right: Array[Int]): Array[Int] = {
        val res = new Array[Int](left.length + right.length)
        var i = 0; var j = 0; var k = 0
        while (i < left.length && j < right.length) {
            if (left(i) <= right(j)) { res(k) = left(i); i += 1 }
            else { res(k) = right(j); j += 1 }
            k += 1
        }
        while (i < left.length) { res(k) = left(i); i += 1; k += 1 }
        while (j < right.length) { res(k) = right(j); j += 1; k += 1 }
        res
    }
}`,
    dart: `class Solution {
  List<int> sortArray(List<int> nums) {
    if (nums.length <= 1) return nums;
    int mid = nums.length ~/ 2;
    List<int> left = sortArray(nums.sublist(0, mid));
    List<int> right = sortArray(nums.sublist(mid));
    return merge(left, right);
  }

  List<int> merge(List<int> left, List<int> right) {
    List<int> res = []; int i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) res.add(left[i++]);
      else res.add(right[j++]);
    }
    res.addAll(left.sublist(i));
    res.addAll(right.sublist(j));
    return res;
  }
}`,
    lua: `function sortArray(nums)
    if #nums <= 1 then return nums end
    local mid = math.floor(#nums / 2)
    local left, right = {}, {}
    for i = 1, mid do table.insert(left, nums[i]) end
    for i = mid + 1, #nums do table.insert(right, nums[i]) end
    return merge(sortArray(left), sortArray(right))
end

function merge(left, right)
    local res = {}
    local i, j = 1, 1
    while i <= #left and j <= #right do
        if left[i] <= right[j] then
            table.insert(res, left[i]); i = i + 1
        else
            table.insert(res, right[j]); j = j + 1
        end
    end
    while i <= #left do table.insert(res, left[i]); i = i + 1 end
    while j <= #right do table.insert(res, right[j]); j = j + 1 end
    return res
end`,
    perl: `sub sort_array {
    my ($nums) = @_;
    my $len = scalar(@$nums);
    return $nums if $len <= 1;
    my $mid = int($len / 2);
    my @left = @$nums[0 .. $mid - 1];
    my @right = @$nums[$mid .. $len - 1];
    return merge(sort_array(\\@left), sort_array(\\@right));
}

sub merge {
    my ($left, $right) = @_;
    my @res; my ($i, $j) = (0, 0);
    while ($i < scalar(@$left) && $j < scalar(@$right)) {
        if ($left->[$i] <= $right->[$j]) { push @res, $left->[$i++]; }
        else { push @res, $right->[$j++]; }
    }
    push @res, @$left[$i .. $#$left] if $i < scalar(@$left);
    push @res, @$right[$j .. $#$right] if $j < scalar(@$right);
    return \\@res;
}`,
    r: `sort_array <- function(nums) {
    if (length(nums) <= 1) return(nums)
    mid <- length(nums) %/% 2
    left <- sort_array(nums[1:mid])
    right <- sort_array(nums[(mid + 1):length(nums)])
    merge_arr <- function(l, r) {
        res <- c(); i <- 1; j <- 1
        while (i <= length(l) && j <= length(r)) {
            if (l[i] <= r[j]) { res <- c(res, l[i]); i <- i + 1 }
            else { res <- c(res, r[j]); j <- j + 1 }
        }
        if (i <= length(l)) res <- c(res, l[i:length(l)])
        if (j <= length(r)) res <- c(res, r[j:length(r)])
        return(res)
    }
    return(merge_arr(left, right))
}`
  }
};
