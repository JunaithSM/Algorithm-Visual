export interface LanguageSpec {
  id: string;
  name: string;
  extension: string;
  sampleCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageSpec[] = [
  {
    id: "java",
    name: "Java",
    extension: ".java",
    sampleCode: `class Solution {
    public int linearSearch(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) {
                return i;
            }
        }
        return -1;
    }
}`
  },
  {
    id: "c",
    name: "C",
    extension: ".c",
    sampleCode: `int linearSearch(int* nums, int numsSize, int target) {
    for (int i = 0; i < numsSize; i++) {
        if (nums[i] == target) {
            return i;
        }
    }
    return -1;
}`
  },
  {
    id: "cpp",
    name: "C++",
    extension: ".cpp",
    sampleCode: `#include <vector>

class Solution {
public:
    int linearSearch(std::vector<int>& nums, int target) {
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] == target) {
                return i;
            }
        }
        return -1;
    }
};`
  },
  {
    id: "python",
    name: "Python",
    extension: ".py",
    sampleCode: `class Solution:
    def linearSearch(self, nums: list[int], target: int) -> int:
        for i, num in enumerate(nums):
            if num == target:
                return i
        return -1`
  },
  {
    id: "javascript",
    name: "JavaScript",
    extension: ".js",
    sampleCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var linearSearch = function(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === target) {
            return i;
        }
    }
    return -1;
};`
  },
  {
    id: "typescript",
    name: "TypeScript",
    extension: ".ts",
    sampleCode: `function linearSearch(nums: number[], target: number): number {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === target) {
            return i;
        }
    }
    return -1;
};`
  },
  {
    id: "go",
    name: "Go",
    extension: ".go",
    sampleCode: `func linearSearch(nums []int, target int) int {
    for i, num := range nums {
        if num == target {
            return i
        }
    }
    return -1
}`
  },
  {
    id: "rust",
    name: "Rust",
    extension: ".rs",
    sampleCode: `impl Solution {
    pub fn linear_search(nums: Vec<i32>, target: i32) -> i32 {
        for (i, &num) in nums.iter().enumerate() {
            if num == target {
                return i as i32;
            }
        }
        -1
    }
}`
  },
  {
    id: "csharp",
    name: "C#",
    extension: ".cs",
    sampleCode: `public class Solution {
    public int LinearSearch(int[] nums, int target) {
        for (int i = 0; i < nums.Length; i++) {
            if (nums[i] == target) {
                return i;
            }
        }
        return -1;
    }
}`
  },
  {
    id: "kotlin",
    name: "Kotlin",
    extension: ".kt",
    sampleCode: `class Solution {
    fun linearSearch(nums: IntArray, target: Int): Int {
        for (i in nums.indices) {
            if (nums[i] == target) {
                return i
            }
        }
        return -1
    }
}`
  },
  {
    id: "swift",
    name: "Swift",
    extension: ".swift",
    sampleCode: `class Solution {
    func linearSearch(_ nums: [Int], _ target: Int) -> Int {
        for (index, num) in nums.enumerated() {
            if num == target {
                return index
            }
        }
        return -1
    }
}`
  },
  {
    id: "php",
    name: "PHP",
    extension: ".php",
    sampleCode: `class Solution {
    /**
     * @param Integer[] $nums
     * @param Integer $target
     * @return Integer
     */
    function linearSearch($nums, $target) {
        foreach ($nums as $i => $num) {
            if ($num === $target) {
                return $i;
            }
        }
        return -1;
    }
}`
  },
  {
    id: "ruby",
    name: "Ruby",
    extension: ".rb",
    sampleCode: `# @param {Integer[]} nums
# @param {Integer} target
# @return {Integer}
def linear_search(nums, target)
  nums.each_with_index do |num, i|
    return i if num == target
  end
  -1
end`
  },
  {
    id: "scala",
    name: "Scala",
    extension: ".scala",
    sampleCode: `object Solution {
    def linearSearch(nums: Array[Int], target: Int): Int = {
        for (i <- nums.indices) {
            if (nums(i) == target) return i
        }
        -1
    }
}`
  },
  {
    id: "dart",
    name: "Dart",
    extension: ".dart",
    sampleCode: `class Solution {
  int linearSearch(List<int> nums, int target) {
    for (int i = 0; i < nums.length; i++) {
      if (nums[i] == target) {
        return i;
      }
    }
    return -1;
  }
}`
  },
  {
    id: "lua",
    name: "Lua",
    extension: ".lua",
    sampleCode: `function linearSearch(nums, target)
    for i, num in ipairs(nums) do
        if num == target then
            return i - 1 -- 0-based index
        end
    end
    return -1
end`
  },
  {
    id: "perl",
    name: "Perl",
    extension: ".pl",
    sampleCode: `sub linear_search {
    my ($nums, $target) = @_;
    for my $i (0 .. $#$nums) {
        return $i if $nums->[$i] == $target;
    }
    return -1;
}`
  },
  {
    id: "r",
    name: "R",
    extension: ".R",
    sampleCode: `linear_search <- function(nums, target) {
    for (i in seq_along(nums)) {
        if (nums[i] == target) {
            return(i - 1)
        }
    }
    return(-1)
}`
  }
];

export function getLanguageSpec(languageId: string): LanguageSpec {
  const found = SUPPORTED_LANGUAGES.find(
    (lang) => lang.id.toLowerCase() === languageId.toLowerCase()
  );
  return found || {
    id: languageId,
    name: languageId.toUpperCase(),
    extension: `.${languageId}`,
    sampleCode: `// Solution for ${languageId}\n`
  };
}
