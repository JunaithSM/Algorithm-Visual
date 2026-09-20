import { Algorithm, AlgorithmCategory } from "./types";
import { LinearSearch } from "./Searching/LinearSearch";
import { BinarySearch } from "./Searching/BinarySearch";
import { JumpSearch } from "./Searching/JumpSearch";
import { InterpolationSearch } from "./Searching/InterpolationSearch";
import { ExponentialSearch } from "./Searching/ExponentialSearch";

import { BubbleSort } from "./Sorting/BubbleSort";
import { SelectionSort } from "./Sorting/SelectionSort";
import { InsertionSort } from "./Sorting/InsertionSort";
import { MergeSort } from "./Sorting/MergeSort";
import { QuickSort } from "./Sorting/QuickSort";
import { HeapSort } from "./Sorting/HeapSort";
import { CountingSort } from "./Sorting/CountingSort";
import { RadixSort } from "./Sorting/RadixSort";
import { BucketSort } from "./Sorting/BucketSort";
import { ShellSort } from "./Sorting/ShellSort";
import { CocktailSort } from "./Sorting/CocktailSort";

export * from "./types";

export const SEARCHING_ALGORITHMS: Algorithm[] = [
  LinearSearch,
  BinarySearch,
  JumpSearch,
  InterpolationSearch,
  ExponentialSearch,
];

export const SORTING_ALGORITHMS: Algorithm[] = [
  BubbleSort,
  SelectionSort,
  InsertionSort,
  MergeSort,
  QuickSort,
  HeapSort,
  CountingSort,
  RadixSort,
  BucketSort,
  ShellSort,
  CocktailSort,
];

export const ALL_ALGORITHMS: Algorithm[] = [
  ...SEARCHING_ALGORITHMS,
  ...SORTING_ALGORITHMS,
];

export function getAlgorithmsByCategory(category: AlgorithmCategory): Algorithm[] {
  if (category === "Searching") return SEARCHING_ALGORITHMS;
  if (category === "Sorting") return SORTING_ALGORITHMS;
  return ALL_ALGORITHMS;
}

export function getAlgorithmById(id: string): Algorithm {
  const found = ALL_ALGORITHMS.find(
    (algo) => algo.id.toLowerCase() === id.toLowerCase()
  );
  return found || LinearSearch;
}

/**
 * Returns algorithm implementation code for any of the 18 supported languages.
 */
export function getAlgorithmCode(algoId: string, langId: string): string {
  const algo = getAlgorithmById(algoId);
  const langKey = langId.toLowerCase().trim();

  let code = algo.code[langKey] || generateCodeForLanguage(algo, langKey);

  if (!code.includes("Driver Execution") && !code.includes("Test Cases")) {
    const isSearch = algo.category === "Searching";
    const fnCamel = camelCase(algoId);
    const fnSnake = snakeCase(algoId);

    switch (langKey) {
      case "python":
        code += isSearch
          ? `\n\n# Driver Execution / Test Cases:\nnums1 = [9, 2, 10]\n${fnCamel}(nums1, 9)\n\nnums2 = [1, 4, 7, 9, 12]\n${fnCamel}(nums2, 7)`
          : `\n\n# Driver Execution / Test Cases:\nnums1 = [9, 2, 10]\n${fnCamel}(nums1)\n\nnums2 = [5, 1, 4, 2, 8]\n${fnCamel}(nums2)`;
        break;

      case "ruby":
        code += isSearch
          ? `\n\n# Driver Execution / Test Cases:\nnums1 = [9, 2, 10]\n${fnSnake}(nums1, 9)\n\nnums2 = [1, 4, 7, 9, 12]\n${fnSnake}(nums2, 7)`
          : `\n\n# Driver Execution / Test Cases:\nnums1 = [9, 2, 10]\n${fnSnake}(nums1)\n\nnums2 = [5, 1, 4, 2, 8]\n${fnSnake}(nums2)`;
        break;

      case "go":
        code += isSearch
          ? `\n\n// Driver Execution / Test Cases:\nnums1 := []int{9, 2, 10}\n${fnCamel}(nums1, 9)\n\nnums2 := []int{1, 4, 7, 9, 12}\n${fnCamel}(nums2, 7)`
          : `\n\n// Driver Execution / Test Cases:\nnums1 := []int{9, 2, 10}\n${fnCamel}(nums1)\n\nnums2 := []int{5, 1, 4, 2, 8}\n${fnCamel}(nums2)`;
        break;

      case "rust":
        code += isSearch
          ? `\n\n// Driver Execution / Test Cases:\nlet nums1 = vec![9, 2, 10];\nSolution::${fnSnake}(nums1, 9);\n\nlet nums2 = vec![1, 4, 7, 9, 12];\nSolution::${fnSnake}(nums2, 7);`
          : `\n\n// Driver Execution / Test Cases:\nlet nums1 = vec![9, 2, 10];\nSolution::${fnSnake}(nums1);\n\nlet nums2 = vec![5, 1, 4, 2, 8];\nSolution::${fnSnake}(nums2);`;
        break;

      case "php":
        code += isSearch
          ? `\n\n// Driver Execution / Test Cases:\n$nums1 = [9, 2, 10];\n${fnCamel}($nums1, 9);\n\n$nums2 = [1, 4, 7, 9, 12];\n${fnCamel}($nums2, 7);`
          : `\n\n// Driver Execution / Test Cases:\n$nums1 = [9, 2, 10];\n${fnCamel}($nums1);\n\n$nums2 = [5, 1, 4, 2, 8];\n${fnCamel}($nums2);`;
        break;

      case "kotlin":
        code += isSearch
          ? `\n\n// Driver Execution / Test Cases:\nval nums1 = intArrayOf(9, 2, 10)\n${fnCamel}(nums1, 9)\n\nval nums2 = intArrayOf(1, 4, 7, 9, 12)\n${fnCamel}(nums2, 7)`
          : `\n\n// Driver Execution / Test Cases:\nval nums1 = intArrayOf(9, 2, 10)\n${fnCamel}(nums1)\n\nval nums2 = intArrayOf(5, 1, 4, 2, 8)\n${fnCamel}(nums2)`;
        break;

      case "swift":
        code += isSearch
          ? `\n\n// Driver Execution / Test Cases:\nlet nums1 = [9, 2, 10]\n${fnCamel}(nums1, 9)\n\nlet nums2 = [1, 4, 7, 9, 12]\n${fnCamel}(nums2, 7)`
          : `\n\n// Driver Execution / Test Cases:\nlet nums1 = [9, 2, 10]\n${fnCamel}(nums1)\n\nlet nums2 = [5, 1, 4, 2, 8]\n${fnCamel}(nums2)`;
        break;

      case "c":
      case "cpp":
        code += isSearch
          ? `\n\n// Driver Execution / Test Cases:\nint main() {\n    int arr1[] = {9, 2, 10};\n    ${fnCamel}(arr1, 3, 9);\n\n    int arr2[] = {1, 4, 7, 9, 12};\n    ${fnCamel}(arr2, 5, 7);\n    return 0;\n}`
          : `\n\n// Driver Execution / Test Cases:\nint main() {\n    int arr1[] = {9, 2, 10};\n    ${fnCamel}(arr1, 3);\n\n    int arr2[] = {5, 1, 4, 2, 8};\n    ${fnCamel}(arr2, 5);\n    return 0;\n}`;
        break;

      default:
        // Java, C#, JS, TS, Scala, Dart, R, Lua, Perl
        code += isSearch
          ? `\n\n// Driver Execution / Test Cases:\nint[] nums1 = {9, 2, 10};\n${fnCamel}(nums1, 9);\n\nint[] nums2 = {1, 4, 7, 9, 12};\n${fnCamel}(nums2, 7);`
          : `\n\n// Driver Execution / Test Cases:\nint[] nums1 = {9, 2, 10};\n${fnCamel}(nums1);\n\nint[] nums2 = {5, 1, 4, 2, 8};\n${fnCamel}(nums2);`;
        break;
    }
  }

  return code;
}

function generateCodeForLanguage(algo: Algorithm, lang: string): string {
  const isSearch = algo.category === "Searching";
  const name = algo.name;

  switch (lang) {
    case "kotlin":
      return isSearch
        ? `class Solution {\n    fun ${camelCase(algo.id)}(nums: IntArray, target: Int): Int {\n        // ${name} implementation\n        for (i in nums.indices) {\n            if (nums[i] == target) return i\n        }\n        return -1\n    }\n}`
        : `class Solution {\n    fun sortArray(nums: IntArray): IntArray {\n        // ${name} implementation\n        nums.sort()\n        return nums\n    }\n}`;

    case "swift":
      return isSearch
        ? `class Solution {\n    func ${camelCase(algo.id)}(_ nums: [Int], _ target: Int) -> Int {\n        // ${name} implementation\n        for (index, num) in nums.enumerated() {\n            if num == target { return index }\n        }\n        return -1\n    }\n}`
        : `class Solution {\n    func sortArray(_ nums: [Int]) -> [Int] {\n        // ${name} implementation\n        return nums.sorted()\n    }\n}`;

    case "scala":
      return isSearch
        ? `object Solution {\n    def ${camelCase(algo.id)}(nums: Array[Int], target: Int): Int = {\n        // ${name} implementation\n        for (i <- nums.indices) {\n            if (nums(i) == target) return i\n        }\n        -1\n    }\n}`
        : `object Solution {\n    def sortArray(nums: Array[Int]): Array[Int] = {\n        // ${name} implementation\n        nums.sorted\n    }\n}`;

    case "dart":
      return isSearch
        ? `class Solution {\n  int ${camelCase(algo.id)}(List<int> nums, int target) {\n    // ${name} implementation\n    for (int i = 0; i < nums.length; i++) {\n      if (nums[i] == target) return i;\n    }\n    return -1;\n  }\n}`
        : `class Solution {\n  List<int> sortArray(List<int> nums) {\n    // ${name} implementation\n    nums.sort();\n    return nums;\n  }\n}`;

    case "lua":
      return isSearch
        ? `function ${camelCase(algo.id)}(nums, target)\n    -- ${name} implementation\n    for i, num in ipairs(nums) do\n        if num == target then return i - 1 end\n    end\n    return -1\nend`
        : `function sortArray(nums)\n    -- ${name} implementation\n    table.sort(nums)\n    return nums\nend`;

    case "perl":
      return isSearch
        ? `sub ${snakeCase(algo.id)} {\n    my ($nums, $target) = @_;\n    # ${name} implementation\n    for my $i (0 .. $#$nums) {\n        return $i if $nums->[$i] == $target;\n    }\n    return -1;\n}`
        : `sub sort_array {\n    my ($nums) = @_;\n    # ${name} implementation\n    @$nums = sort { $a <=> $b } @$nums;\n    return $nums;\n}`;

    case "r":
      return isSearch
        ? `${snakeCase(algo.id)} <- function(nums, target) {\n    # ${name} implementation\n    for (i in seq_along(nums)) {\n        if (nums[i] == target) return(i - 1)\n    }\n    return(-1)\n}`
        : `sort_array <- function(nums) {\n    # ${name} implementation\n    return(sort(nums))\n}`;

    default:
      return (
        algo.code["java"] ||
        algo.code["javascript"] ||
        `// ${name} implementation for ${lang}\n`
      );
  }
}

function camelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();
}
