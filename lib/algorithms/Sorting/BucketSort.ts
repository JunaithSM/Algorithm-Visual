import { Algorithm } from "../types";

export const BucketSort: Algorithm = {
  id: "BucketSort",
  name: "Bucket Sort",
  category: "Sorting",
  description: "Distributes elements into a number of buckets, then sorts each bucket individually.",
  code: {
    java: `import java.util.*;

class Solution {
    public double[] bucketSort(double[] nums) {
        int n = nums.length;
        if (n <= 1) return nums;

        List<Double>[] buckets = new ArrayList[n];
        for (int i = 0; i < n; i++) buckets[i] = new ArrayList<>();

        for (double num : nums) {
            int bIdx = (int) (n * num);
            buckets[bIdx].add(num);
        }

        for (List<Double> bucket : buckets) {
            Collections.sort(bucket);
        }

        int idx = 0;
        for (List<Double> bucket : buckets) {
            for (double num : bucket) {
                nums[idx++] = num;
            }
        }
        return nums;
    }
}`,
    c: `#include <stdio.h>
#include <stdlib.h>

void bucketSort(double* nums, int numsSize) {
    if (numsSize <= 1) return;
    int n = numsSize;
    double** buckets = (double**)malloc(n * sizeof(double*));
    int* counts = (int*)calloc(n, sizeof(int));
    for (int i = 0; i < n; i++) buckets[i] = (double*)malloc(n * sizeof(double));

    for (int i = 0; i < n; i++) {
        int bIdx = n * nums[i];
        if (bIdx >= n) bIdx = n - 1;
        buckets[bIdx][counts[bIdx]++] = nums[i];
    }

    int idx = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < counts[i] - 1; j++) {
            for (int k = j + 1; k < counts[i]; k++) {
                if (buckets[i][j] > buckets[i][k]) {
                    double tmp = buckets[i][j]; buckets[i][j] = buckets[i][k]; buckets[i][k] = tmp;
                }
            }
        }
        for (int j = 0; j < counts[i]; j++) nums[idx++] = buckets[i][j];
        free(buckets[i]);
    }
    free(buckets); free(counts);
}`,
    cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    std::vector<double> bucketSort(std::vector<double>& nums) {
        int n = nums.size();
        if (n <= 1) return nums;

        std::vector<std::vector<double>> buckets(n);
        for (double num : nums) {
            int bIdx = n * num;
            if (bIdx >= n) bIdx = n - 1;
            buckets[bIdx].push_back(num);
        }

        for (auto& bucket : buckets) {
            std::sort(bucket.begin(), bucket.end());
        }

        int idx = 0;
        for (const auto& bucket : buckets) {
            for (double num : bucket) {
                nums[idx++] = num;
            }
        }
        return nums;
    }
};`,
    python: `class Solution:
    def bucketSort(self, nums: list[float]) -> list[float]:
        n = len(nums)
        if n <= 1: return nums

        buckets = [[] for _ in range(n)]
        for num in nums:
            b_idx = int(n * num)
            if b_idx >= n: b_idx = n - 1
            buckets[b_idx].append(num)

        for bucket in buckets:
            bucket.sort()

        result = []
        for bucket in buckets:
            result.extend(bucket)
        return result`,
    javascript: `var bucketSort = function(nums) {
    const n = nums.length;
    if (n <= 1) return nums;

    const buckets = Array.from({ length: n }, () => []);
    for (let num of nums) {
        let bIdx = Math.min(Math.floor(n * num), n - 1);
        buckets[bIdx].push(num);
    }

    for (let bucket of buckets) {
        bucket.sort((a, b) => a - b);
    }

    return buckets.flat();
};`,
    typescript: `function bucketSort(nums: number[]): number[] {
    const n = nums.length;
    if (n <= 1) return nums;

    const buckets: number[][] = Array.from({ length: n }, () => []);
    for (let num of nums) {
        let bIdx = Math.min(Math.floor(n * num), n - 1);
        buckets[bIdx].push(num);
    }

    for (let bucket of buckets) {
        bucket.sort((a, b) => a - b);
    }

    return buckets.flat();
}`,
    go: `import "sort"

func bucketSort(nums []float64) []float64 {
    n := len(nums)
    if n <= 1 { return nums }

    buckets := make([][]float64, n)
    for _, num := range nums {
        bIdx := int(float64(n) * num)
        if bIdx >= n { bIdx = n - 1 }
        buckets[bIdx] = append(buckets[bIdx], num)
    }

    res := make([]float64, 0, n)
    for _, bucket := range buckets {
        sort.Float64s(bucket)
        res = append(res, bucket...)
    }
    return res
}`,
    rust: `impl Solution {
    pub fn bucket_sort(mut nums: Vec<f64>) -> Vec<f64> {
        let n = nums.len();
        if n <= 1 { return nums; }

        let mut buckets: Vec<Vec<f64>> = vec![vec![]; n];
        for &num in &nums {
            let mut b_idx = (n as f64 * num) as usize;
            if b_idx >= n { b_idx = n - 1; }
            buckets[b_idx].push(num);
        }

        let mut res = Vec::with_capacity(n);
        for mut bucket in buckets {
            bucket.sort_by(|a, b| a.partial_cmp(b).unwrap());
            res.extend(bucket);
        }
        res
    }
}`,
    csharp: `using System;
using System.Collections.Generic;

public class Solution {
    public double[] BucketSort(double[] nums) {
        int n = nums.Length;
        if (n <= 1) return nums;

        List<double>[] buckets = new List<double>[n];
        for (int i = 0; i < n; i++) buckets[i] = new List<double>();

        foreach (double num in nums) {
            int bIdx = Math.Min((int)(n * num), n - 1);
            buckets[bIdx].Add(num);
        }

        List<double> res = new List<double>();
        foreach (var bucket in buckets) {
            bucket.Sort();
            res.AddRange(bucket);
        }
        return res.ToArray();
    }
}`,
    kotlin: `class Solution {
    fun bucketSort(nums: DoubleArray): DoubleArray {
        val n = nums.size
        if (n <= 1) return nums

        val buckets = Array(n) { mutableListOf<Double>() }
        for (num in nums) {
            val bIdx = (n * num).toInt().coerceAtMost(n - 1)
            buckets[bIdx].add(num)
        }

        val res = DoubleArray(n)
        var idx = 0
        for (bucket in buckets) {
            bucket.sort()
            for (num in bucket) res[idx++] = num
        }
        return res
    }
}`,
    swift: `class Solution {
    func bucketSort(_ nums: [Double]) -> [Double] {
        let n = nums.count
        guard n > 1 else { return nums }

        var buckets = Array(repeating: [Double](), count: n)
        for num in nums {
            let bIdx = min(Int(Double(n) * num), n - 1)
            buckets[bIdx].append(num)
        }

        var res = [Double]()
        for var bucket in buckets {
            bucket.sort()
            res.append(contentsOf: bucket)
        }
        return res
    }
}`,
    php: `class Solution {
    function bucketSort($nums) {
        $n = count($nums);
        if ($n <= 1) return $nums;

        $buckets = array_fill(0, $n, []);
        foreach ($nums as $num) {
            $bIdx = min((int)($n * $num), $n - 1);
            $buckets[$bIdx][] = $num;
        }

        $res = [];
        foreach ($buckets as $bucket) {
            sort($bucket);
            $res = array_merge($res, $bucket);
        }
        return $res;
    }
}`,
    ruby: `def bucket_sort(nums)
  n = nums.length
  return nums if n <= 1

  buckets = Array.new(n) { [] }
  nums.each do |num|
    b_idx = [(n * num).floor, n - 1].min
    buckets[b_idx] << num
  end

  buckets.each(&:sort!).flatten
end`,
    scala: `object Solution {
    def bucketSort(nums: Array[Double]): Array[Double] = {
        val n = nums.length
        if (n <= 1) return nums

        val buckets = Array.fill(n)(collection.mutable.ArrayBuffer[Double]())
        for (num <- nums) {
            val bIdx = math.min((n * num).toInt, n - 1)
            buckets(bIdx) += num
        }

        buckets.flatMap(_.sorted).toArray
    }
}`,
    dart: `import 'dart:math';

class Solution {
  List<double> bucketSort(List<double> nums) {
    int n = nums.length;
    if (n <= 1) return nums;

    List<List<double>> buckets = List.generate(n, (_) => []);
    for (double num in nums) {
      int bIdx = min((n * num).floor(), n - 1);
      buckets[bIdx].add(num);
    }

    List<double> res = [];
    for (var bucket in buckets) {
      bucket.sort();
      res.addAll(bucket);
    }
    return res;
  }
}`,
    lua: `function bucketSort(nums)
    local n = #nums
    if n <= 1 then return nums end

    local buckets = {}
    for i = 1, n do buckets[i] = {} end

    for _, num in ipairs(nums) do
        local bIdx = math.min(math.floor(n * num) + 1, n)
        table.insert(buckets[bIdx], num)
    end

    local res = {}
    for _, bucket in ipairs(buckets) do
        table.sort(bucket)
        for _, num in ipairs(bucket) do table.insert(res, num) end
    end
    return res
end`,
    perl: `sub bucket_sort {
    my ($nums) = @_;
    my $n = scalar(@$nums);
    return $nums if $n <= 1;

    my @buckets = map { [] } (1 .. $n);
    foreach my $num (@$nums) {
        my $bIdx = int($n * $num);
        $bIdx = $n - 1 if $bIdx >= $n;
        push @{$buckets[$bIdx]}, $num;
    }

    my @res;
    foreach my $bucket (@buckets) {
        @$bucket = sort { $a <=> $b } @$bucket;
        push @res, @$bucket;
    }
    return \\@res;
}`,
    r: `bucket_sort <- function(nums) {
    n <- length(nums)
    if (n <= 1) return(nums)

    buckets <- vector("list", n)
    for (num in nums) {
        bIdx <- min(floor(n * num) + 1, n)
        buckets[[bIdx]] <- c(buckets[[bIdx]], num)
    }

    res <- c()
    for (bucket in buckets) {
        if (length(bucket) > 0) res <- c(res, sort(bucket))
    }
    return(res)
}`
  }
};
