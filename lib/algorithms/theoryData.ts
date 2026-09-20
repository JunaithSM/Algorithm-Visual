export interface ComplexityInfo {
  bestTime: string;
  averageTime: string;
  worstTime: string;
  spaceComplexity: string;
  stable: boolean;
  inPlace: boolean;
}

export interface ExampleStep {
  stepNumber: number;
  title: string;
  description: string;
  visualState?: string;
}

export interface TheoreticalExample {
  title: string;
  initialInput: string;
  target?: string;
  steps: ExampleStep[];
  conclusion: string;
}

export interface AlgorithmTheoryData {
  id: string;
  name: string;
  category: "Searching" | "Sorting";
  summary: string;
  realWorldAnalogy: string;
  coreIntuition: string;
  stepByStepLogic: string[];
  complexity: ComplexityInfo;
  example: TheoreticalExample;
  pros: string[];
  cons: string[];
  applications: string[];
}

export const ALGORITHM_THEORY_DATA: Record<string, AlgorithmTheoryData> = {
  LinearSearch: {
    id: "LinearSearch",
    name: "Linear Search",
    category: "Searching",
    summary: "Sequentially inspects every element in a list from start to end until the desired target value is found or the list terminates.",
    realWorldAnalogy: "Looking for a specific book title on an unsorted library shelf by scanning every single spine one by one from left to right.",
    coreIntuition: "Linear Search makes zero assumptions about the arrangement of elements. It checks each item individually in sequential order.",
    stepByStepLogic: [
      "Begin at the first element of the collection (Index 0).",
      "Compare the value at the current index with the target search value.",
      "If the values match, stop immediately and return the current index.",
      "If the values do not match, move forward to the next index in sequence.",
      "Repeat steps 2 to 4 until the target is found or all elements have been examined.",
      "If the end of the collection is reached without a match, report that the item does not exist."
    ],
    complexity: {
      bestTime: "O(1)",
      averageTime: "O(N)",
      worstTime: "O(N)",
      spaceComplexity: "O(1)",
      stable: true,
      inPlace: true
    },
    example: {
      title: "Searching for Target = 42 in an Unsorted Array",
      initialInput: "[ 14, 29, 42, 7, 85 ]",
      target: "42",
      steps: [
        {
          stepNumber: 1,
          title: "Inspect Index 0",
          description: "Compare element 14 with target 42. They are not equal. Move to Index 1.",
          visualState: "[ 14 (Checked), 29, 42, 7, 85 ] | Current: 14 ≠ 42"
        },
        {
          stepNumber: 2,
          title: "Inspect Index 1",
          description: "Compare element 29 with target 42. They are not equal. Move to Index 2.",
          visualState: "[ 14, 29 (Checked), 42, 7, 85 ] | Current: 29 ≠ 42"
        },
        {
          stepNumber: 3,
          title: "Inspect Index 2",
          description: "Compare element 42 with target 42. Match found!",
          visualState: "[ 14, 29, 42 (MATCH!), 7, 85 ] | Current: 42 == 42"
        }
      ],
      conclusion: "Target 42 successfully located at Index 2 after 3 comparisons."
    },
    pros: [
      "Simple to understand and implement.",
      "Does not require the dataset to be sorted beforehand.",
      "Works on any data structure (arrays, linked lists, streams)."
    ],
    cons: [
      "Slow performance on large datasets compared to logarithmic search algorithms.",
      "Requires scanning every item in the worst case."
    ],
    applications: [
      "Searching unsorted small lists or collections.",
      "Finding items in single-linked lists without indexing.",
      "First pass lookup in stream data processing."
    ]
  },

  BinarySearch: {
    id: "BinarySearch",
    name: "Binary Search",
    category: "Searching",
    summary: "Efficiently locates a target element in a pre-sorted list by repeatedly dividing the search interval in half.",
    realWorldAnalogy: "Opening a physical dictionary or phonebook right in the middle to see if your target word comes before or after the middle page.",
    coreIntuition: "Because the data is sorted, every single comparison eliminates 50% of the remaining search window.",
    stepByStepLogic: [
      "Establish the search window boundaries: Low at Index 0 and High at Index N - 1.",
      "Calculate the middle position of the current window: Mid = Math.floor((Low + High) / 2).",
      "Compare the target value with the element located at Mid.",
      "If Target matches the element at Mid, search completes successfully.",
      "If Target is smaller than Mid element, narrow the search window to the left half by setting High = Mid - 1.",
      "If Target is larger than Mid element, narrow the search window to the right half by setting Low = Mid + 1.",
      "Repeat from step 2 while Low is less than or equal to High."
    ],
    complexity: {
      bestTime: "O(1)",
      averageTime: "O(log N)",
      worstTime: "O(log N)",
      spaceComplexity: "O(1)",
      stable: true,
      inPlace: true
    },
    example: {
      title: "Searching for Target = 23 in a Sorted Array",
      initialInput: "[ 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 ]",
      target: "23",
      steps: [
        {
          stepNumber: 1,
          title: "Initial State & First Mid Calculation",
          description: "Low = 0, High = 9. Mid = (0 + 9)/2 = 4. Element at Mid (Index 4) is 16. Target 23 > 16. Move search to right sub-array.",
          visualState: "Range [0..9] | Mid = Index 4 (val = 16) | 23 > 16 -> Set Low = 5"
        },
        {
          stepNumber: 2,
          title: "Second Iteration",
          description: "Low = 5, High = 9. Mid = (5 + 9)/2 = 7. Element at Mid (Index 7) is 56. Target 23 < 56. Move search to left sub-array.",
          visualState: "Range [5..9] | Mid = Index 7 (val = 56) | 23 < 56 -> Set High = 6"
        },
        {
          stepNumber: 3,
          title: "Third Iteration",
          description: "Low = 5, High = 6. Mid = (5 + 6)/2 = 5. Element at Mid (Index 5) is 23. Target 23 == 23. Match found!",
          visualState: "Range [5..6] | Mid = Index 5 (val = 23) | 23 == 23 -> Found!"
        }
      ],
      conclusion: "Target 23 successfully located at Index 5 after only 3 iterations (compared to 6 steps in linear search)."
    },
    pros: [
      "Extremely fast with O(log N) runtime; searches 1 million items in just 20 comparisons.",
      "Low memory overhead with O(1) space complexity."
    ],
    cons: [
      "Strictly requires the array to be pre-sorted.",
      "Requires random access data structures (like arrays) to index mid elements directly."
    ],
    applications: [
      "Database indexing and key-value lookups.",
      "Standard library search functions (Arrays.binarySearch, std::lower_bound).",
      "Git bisect tool to identify broken commits."
    ]
  },

  JumpSearch: {
    id: "JumpSearch",
    name: "Jump Search",
    category: "Searching",
    summary: "Searches a sorted array by skipping ahead by fixed block steps of size √N, then executing a linear search once target region is bounded.",
    realWorldAnalogy: "Flipping through a textbook chapter by chapter (e.g., 10 pages at a time) until you overshoot your target topic, then flipping back page by page.",
    coreIntuition: "Jumping over blocks avoids checking every element while avoiding the complex mid-indexing logic of binary search on systems where backward traversal is costly.",
    stepByStepLogic: [
      "Calculate optimal jump block size: Step = Math.floor(√N).",
      "Start at Index 0 and jump forward by Step index intervals.",
      "Continue jumping as long as the array element at the block boundary is smaller than the target.",
      "When a block boundary element is reached that is greater than or equal to the target, stop jumping.",
      "Perform a backward linear search starting from the current block boundary back to the previous block boundary.",
      "If target is found during linear search, return its index. Otherwise, return not found."
    ],
    complexity: {
      bestTime: "O(1)",
      averageTime: "O(√N)",
      worstTime: "O(√N)",
      spaceComplexity: "O(1)",
      stable: true,
      inPlace: true
    },
    example: {
      title: "Searching for Target = 55 in a Sorted Array (Length N = 12)",
      initialInput: "[ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 ]",
      target: "55",
      steps: [
        {
          stepNumber: 1,
          title: "Block Step Size Calculation",
          description: "Array length N = 12. Optimal jump size Step = √12 ≈ 3 elements.",
          visualState: "Block Step Size = 3"
        },
        {
          stepNumber: 2,
          title: "Jump Phase",
          description: "Jump to Index 0 (val = 0 < 55). Jump to Index 3 (val = 2 < 55). Jump to Index 6 (val = 8 < 55). Jump to Index 9 (val = 34 < 55). Jump to Index 11 (val = 89 > 55). Overshot target!",
          visualState: "Jump boundary reached at Index 11 (val = 89). Target 55 is bounded between Index 9 and Index 11."
        },
        {
          stepNumber: 3,
          title: "Linear Search Phase",
          description: "Perform linear search within range [Index 9..11]: Check Index 9 (34 ≠ 55). Check Index 10 (55 == 55). Match found!",
          visualState: "Index 10 (val = 55) == Target 55"
        }
      ],
      conclusion: "Target 55 located at Index 10 in 4 jumps + 2 linear checks."
    },
    pros: [
      "Faster than Linear Search with O(√N) comparisons.",
      "Only requires jumping forward, making it ideal for systems where stepping backward is expensive."
    ],
    cons: [
      "Slower than Binary Search (O(log N)).",
      "Requires array to be pre-sorted."
    ],
    applications: [
      "Searching on linear storage devices (tapes/disks) where forward jumps are fast.",
      "Hybrid search algorithms."
    ]
  },

  InterpolationSearch: {
    id: "InterpolationSearch",
    name: "Interpolation Search",
    category: "Searching",
    summary: "An enhanced variant of Binary Search for uniformly distributed sorted data that estimates the probable position of the target based on key values.",
    realWorldAnalogy: "Looking up the word 'Apple' near the very beginning of a physical dictionary rather than opening the book right at the middle 'M' page.",
    coreIntuition: "If data values grow linearly, we can estimate where a target value resides using linear interpolation formulas.",
    stepByStepLogic: [
      "Ensure array is sorted and values are uniformly distributed.",
      "Calculate estimated target probe position: Position = Low + Math.floor(((Target - arr[Low]) * (High - Low)) / (arr[High] - arr[Low])).",
      "If element at calculated Position matches Target, search complete.",
      "If element at Position is smaller than Target, set Low = Position + 1.",
      "If element at Position is larger than Target, set High = Position - 1.",
      "Repeat while Low <= High and Target lies within range [arr[Low]..arr[High]]."
    ],
    complexity: {
      bestTime: "O(1)",
      averageTime: "O(log log N)",
      worstTime: "O(N)",
      spaceComplexity: "O(1)",
      stable: true,
      inPlace: true
    },
    example: {
      title: "Searching for Target = 70 in Uniformly Distributed Sorted Array",
      initialInput: "[ 10, 20, 30, 40, 50, 60, 70, 80, 90 ]",
      target: "70",
      steps: [
        {
          stepNumber: 1,
          title: "Interpolation Probe Calculation",
          description: "Low = 0 (10), High = 8 (90). Probe pos = 0 + [(70 - 10)*(8 - 0)] / (90 - 10) = (60 * 8) / 80 = Index 6.",
          visualState: "Calculated Position = Index 6"
        },
        {
          stepNumber: 2,
          title: "Inspect Calculated Position",
          description: "Check value at Index 6. Value is 70. Target is 70. Exact match!",
          visualState: "arr[6] == 70 (Found on 1st probe)"
        }
      ],
      conclusion: "Target 70 located in 1 single probe due to uniform distribution."
    },
    pros: [
      "Blazing fast average time complexity of O(log log N) on uniformly distributed data.",
      "Fewer steps than Binary Search for large uniform datasets."
    ],
    cons: [
      "Degenerates to O(N) linear time if data distribution is heavily skewed or non-uniform.",
      "Requires pre-sorted numerical data."
    ],
    applications: [
      "Searching numeric datasets with uniform distribution (sensor logs, timestamps).",
      "Phone numbers or numerical catalog lookups."
    ]
  },

  ExponentialSearch: {
    id: "ExponentialSearch",
    name: "Exponential Search",
    category: "Searching",
    summary: "Finds the range where target resides by exponentially increasing index steps (1, 2, 4, 8...), then executes Binary Search inside that range.",
    realWorldAnalogy: "Zooming out a map 1x, 2x, 4x, 8x to locate a region before doing a detailed local search.",
    coreIntuition: "Quickly bounds target position in unbounded or infinitely growing sorted datasets.",
    stepByStepLogic: [
      "Check if the very first element (Index 0) is the target.",
      "Initialize index Bound = 1.",
      "Double Bound (Bound = Bound * 2) while Bound < N and arr[Bound] <= Target.",
      "Once Target is bounded between Index (Bound / 2) and Min(Bound, N - 1), stop doubling.",
      "Perform standard Binary Search within range [Bound / 2 .. Min(Bound, N - 1)]."
    ],
    complexity: {
      bestTime: "O(1)",
      averageTime: "O(log N)",
      worstTime: "O(log N)",
      spaceComplexity: "O(1)",
      stable: true,
      inPlace: true
    },
    example: {
      title: "Searching for Target = 21 in Sorted Array",
      initialInput: "[ 3, 6, 9, 12, 15, 18, 21, 24, 27, 30 ]",
      target: "21",
      steps: [
        {
          stepNumber: 1,
          title: "Exponential Range Bounding",
          description: "Check Index 1 (6 < 21) -> Double to Index 2 (9 < 21) -> Double to Index 4 (15 < 21) -> Double to Index 8 (27 > 21). Stop doubling!",
          visualState: "Range bounded between Index 4 (val = 15) and Index 8 (val = 27)."
        },
        {
          stepNumber: 2,
          title: "Binary Search within Bounded Range",
          description: "Execute Binary Search on sub-array [15, 18, 21, 24, 27]. Mid Index 6 has value 21. Match found!",
          visualState: "Found Target 21 at Index 6."
        }
      ],
      conclusion: "Target 21 located in O(log N) steps with fast early bounding."
    },
    pros: [
      "Excellent for unbounded or infinite streams where array size N is unknown beforehand.",
      "Faster than Binary Search when target is near the beginning of array."
    ],
    cons: [
      "Requires pre-sorted data."
    ],
    applications: [
      "Searching unbounded or dynamic data streams.",
      "Lookups in large sorted files on disk."
    ]
  },

  BubbleSort: {
    id: "BubbleSort",
    name: "Bubble Sort",
    category: "Sorting",
    summary: "Repeatedly steps through the list, compares adjacent element pairs, and swaps them if they are in wrong order. Larger elements bubble up to the end.",
    realWorldAnalogy: "Air bubbles rising in water; heavier elements sink while the largest numbers bubble up to the surface on each pass.",
    coreIntuition: "In every complete pass through the array, the maximum remaining element is guaranteed to bubble into its correct final sorted position at the end.",
    stepByStepLogic: [
      "Start at the beginning of the array (Index 0).",
      "Compare current element with its adjacent neighbor (arr[i] and arr[i+1]).",
      "If left element > right element, swap their positions.",
      "Advance to the next adjacent pair and repeat until reaching the end of the unsorted section.",
      "At the end of Pass 1, the largest element is placed at the last position.",
      "Repeat the process for remaining unsorted elements until a complete pass occurs with zero swaps."
    ],
    complexity: {
      bestTime: "O(N)",
      averageTime: "O(N²)",
      worstTime: "O(N²)",
      spaceComplexity: "O(1)",
      stable: true,
      inPlace: true
    },
    example: {
      title: "Sorting Array [ 5, 1, 4, 2, 8 ]",
      initialInput: "[ 5, 1, 4, 2, 8 ]",
      steps: [
        {
          stepNumber: 1,
          title: "Pass 1",
          description: "Compare 5 & 1 -> Swap [1, 5, 4, 2, 8]. Compare 5 & 4 -> Swap [1, 4, 5, 2, 8]. Compare 5 & 2 -> Swap [1, 4, 2, 5, 8]. Compare 5 & 8 -> OK.",
          visualState: "[ 1, 4, 2, 5, 8 (Sorted) ]"
        },
        {
          stepNumber: 2,
          title: "Pass 2",
          description: "Compare 1 & 4 -> OK. Compare 4 & 2 -> Swap [1, 2, 4, 5, 8]. Compare 4 & 5 -> OK.",
          visualState: "[ 1, 2, 4, 5 (Sorted), 8 (Sorted) ]"
        },
        {
          stepNumber: 3,
          title: "Pass 3",
          description: "Compare 1 & 2 -> OK. Compare 2 & 4 -> OK. Zero swaps occurred in this pass. Sort complete!",
          visualState: "[ 1, 2, 4, 5, 8 ]"
        }
      ],
      conclusion: "Array sorted in 3 passes."
    },
    pros: [
      "Simple concept and implementation.",
      "Stable sort (preserves relative order of equal elements).",
      "Can detect nearly sorted arrays in O(N) time with optimized swap flag."
    ],
    cons: [
      "Inefficient O(N²) quadratic time complexity on average and worst cases.",
      "High number of element swaps."
    ],
    applications: [
      "Educational introduction to sorting concepts.",
      "Detecting nearly sorted lists in real-time systems."
    ]
  },

  SelectionSort: {
    id: "SelectionSort",
    name: "Selection Sort",
    category: "Sorting",
    summary: "Divides the array into sorted and unsorted regions. Repeatedly selects the minimum element from unsorted region and swaps it to the end of sorted region.",
    realWorldAnalogy: "Selecting the shortest person from a crowd and placing them first in line, then finding the second shortest, and repeating.",
    coreIntuition: "Minimizes total element swaps by performing at most 1 swap per pass.",
    stepByStepLogic: [
      "Divide array into sorted sub-array (initially empty) and unsorted sub-array (full array).",
      "Scan the entire unsorted region to find the index of the absolute minimum value.",
      "Swap this minimum value with the first element of the unsorted region.",
      "Expand the sorted region boundary by 1 position to the right.",
      "Repeat until all elements are sorted."
    ],
    complexity: {
      bestTime: "O(N²)",
      averageTime: "O(N²)",
      worstTime: "O(N²)",
      spaceComplexity: "O(1)",
      stable: false,
      inPlace: true
    },
    example: {
      title: "Sorting Array [ 64, 25, 12, 22, 11 ]",
      initialInput: "[ 64, 25, 12, 22, 11 ]",
      steps: [
        {
          stepNumber: 1,
          title: "Pass 1: Find Minimum",
          description: "Minimum in [64, 25, 12, 22, 11] is 11. Swap 11 with first element 64.",
          visualState: "[ 11 (Sorted), 25, 12, 22, 64 ]"
        },
        {
          stepNumber: 2,
          title: "Pass 2: Find Minimum",
          description: "Minimum in unsorted [25, 12, 22, 64] is 12. Swap 12 with 25.",
          visualState: "[ 11, 12 (Sorted), 25, 22, 64 ]"
        },
        {
          stepNumber: 3,
          title: "Pass 3: Find Minimum",
          description: "Minimum in unsorted [25, 22, 64] is 22. Swap 22 with 25.",
          visualState: "[ 11, 12, 22 (Sorted), 25, 64 ]"
        }
      ],
      conclusion: "Array fully sorted with exactly 3 swaps."
    },
    pros: [
      "Performs at most O(N) swaps, making it ideal when write operations are expensive (e.g. Flash memory).",
      "In-place memory utilization O(1)."
    ],
    cons: [
      "Always runs in O(N²) time regardless of whether input is sorted or random.",
      "Unstable sort algorithm."
    ],
    applications: [
      "Flash memory or EEPROM devices where write cycles are limited.",
      "Small arrays where minimal swaps are required."
    ]
  },

  InsertionSort: {
    id: "InsertionSort",
    name: "Insertion Sort",
    category: "Sorting",
    summary: "Builds final sorted array one item at a time by taking each unsorted element and inserting it into its correct position relative to previously sorted items.",
    realWorldAnalogy: "Sorting playing cards in your hand; picking up cards one by one and sliding each into its proper sorted slot among cards held.",
    coreIntuition: "Maintains a sorted left partition and inserts elements into place one by one.",
    stepByStepLogic: [
      "Assume the first element (Index 0) is already sorted.",
      "Pick the next element from unsorted region (Key).",
      "Compare Key with elements in the sorted region from right to left.",
      "Shift elements that are greater than Key one position to the right.",
      "Insert Key into its correct empty slot.",
      "Repeat for all remaining unsorted elements."
    ],
    complexity: {
      bestTime: "O(N)",
      averageTime: "O(N²)",
      worstTime: "O(N²)",
      spaceComplexity: "O(1)",
      stable: true,
      inPlace: true
    },
    example: {
      title: "Sorting Array [ 12, 11, 13, 5, 6 ]",
      initialInput: "[ 12, 11, 13, 5, 6 ]",
      steps: [
        {
          stepNumber: 1,
          title: "Insert Key = 11",
          description: "Compare 11 with 12. 12 > 11, shift 12 right. Insert 11 at start.",
          visualState: "[ 11, 12, 13, 5, 6 ]"
        },
        {
          stepNumber: 2,
          title: "Insert Key = 13",
          description: "Compare 13 with 12. 13 > 12, no shift needed.",
          visualState: "[ 11, 12, 13, 5, 6 ]"
        },
        {
          stepNumber: 3,
          title: "Insert Key = 5",
          description: "Compare 5 with 13, 12, 11. Shift all right. Insert 5 at index 0.",
          visualState: "[ 5, 11, 12, 13, 6 ]"
        },
        {
          stepNumber: 4,
          title: "Insert Key = 6",
          description: "Shift 13, 12, 11 right. Insert 6 at index 1.",
          visualState: "[ 5, 6, 11, 12, 13 ]"
        }
      ],
      conclusion: "Array sorted step-by-step."
    },
    pros: [
      "Blazing fast O(N) on nearly sorted data.",
      "Stable and in-place.",
      "Low overhead for small array sizes (N < 20)."
    ],
    cons: [
      "O(N²) quadratic scaling on reverse sorted or random large arrays."
    ],
    applications: [
      "Base case sub-routine in hybrid sorting algorithms (Timsort, IntroSort).",
      "Online sorting of dynamic incoming data streams."
    ]
  },

  MergeSort: {
    id: "MergeSort",
    name: "Merge Sort",
    category: "Sorting",
    summary: "Divide-and-conquer algorithm that recursively splits array into halves, sorts each half, and merges sorted halves back together.",
    realWorldAnalogy: "Dividing a large stack of papers into smaller piles until single sheets, sorting small pairs, and combining sorted piles into one master stack.",
    coreIntuition: "Merging two pre-sorted lists into a single sorted list takes linear time O(N).",
    stepByStepLogic: [
      "If array contains 1 element or less, it is already sorted; return.",
      "Divide the array into two equal halves (Left and Right).",
      "Recursively apply Merge Sort to the Left half.",
      "Recursively apply Merge Sort to the Right half.",
      "Merge sorted Left and Right halves by comparing front elements and writing smaller value to temporary output array.",
      "Copy merged result back into original array."
    ],
    complexity: {
      bestTime: "O(N log N)",
      averageTime: "O(N log N)",
      worstTime: "O(N log N)",
      spaceComplexity: "O(N)",
      stable: true,
      inPlace: false
    },
    example: {
      title: "Sorting Array [ 38, 27, 43, 3, 9, 82, 10 ]",
      initialInput: "[ 38, 27, 43, 3, 9, 82, 10 ]",
      steps: [
        {
          stepNumber: 1,
          title: "Divide Phase",
          description: "Split into halves [38, 27, 43] and [3, 9, 82, 10]. Sub-divide down to single elements.",
          visualState: "Single elements: [38] [27] [43] [3] [9] [82] [10]"
        },
        {
          stepNumber: 2,
          title: "Sort & Merge Sub-lists",
          description: "Merge [38] & [27] -> [27, 38]. Merge [3] & [9] -> [3, 9]. Merge [82] & [10] -> [10, 82].",
          visualState: "Sub-arrays: [27, 38, 43] and [3, 9, 10, 82]"
        },
        {
          stepNumber: 3,
          title: "Final Master Merge",
          description: "Merge [27, 38, 43] with [3, 9, 10, 82] by comparing front elements sequentially.",
          visualState: "Result: [ 3, 9, 10, 27, 38, 43, 82 ]"
        }
      ],
      conclusion: "Guaranteed O(N log N) sorted result."
    },
    pros: [
      "Guaranteed O(N log N) performance in worst-case scenario.",
      "Stable sort.",
      "Excellent for linked lists and external sorting (huge disk files)."
    ],
    cons: [
      "Requires O(N) additional temporary memory space."
    ],
    applications: [
      "External sorting on huge files exceeding RAM capacity.",
      "Sorting linked lists in O(1) extra space."
    ]
  },

  QuickSort: {
    id: "QuickSort",
    name: "Quick Sort",
    category: "Sorting",
    summary: "Selects a 'pivot' element, partitions array so smaller values go left and larger go right, then recursively sorts partitions.",
    realWorldAnalogy: "Picking a benchmark height in a group of people; everyone shorter stands to the left, everyone taller to the right, then repeating for each sub-group.",
    coreIntuition: "Placing pivot in its exact correct position in O(N) time reduces problem to sub-arrays.",
    stepByStepLogic: [
      "Choose a pivot element from array (e.g. last element).",
      "Partition phase: re-arrange elements such that elements < pivot are shifted left, elements > pivot shifted right.",
      "Place pivot element into its final sorted index between partitions.",
      "Recursively apply Quick Sort to left sub-partition.",
      "Recursively apply Quick Sort to right sub-partition."
    ],
    complexity: {
      bestTime: "O(N log N)",
      averageTime: "O(N log N)",
      worstTime: "O(N²)",
      spaceComplexity: "O(log N)",
      stable: false,
      inPlace: true
    },
    example: {
      title: "Sorting Array [ 10, 80, 30, 90, 40, 50, 70 ] with Pivot = 70",
      initialInput: "[ 10, 80, 30, 90, 40, 50, 70 ]",
      steps: [
        {
          stepNumber: 1,
          title: "Partition around Pivot = 70",
          description: "Compare items with 70. Smaller items [10, 30, 40, 50] move left. Larger [80, 90] move right.",
          visualState: "[ 10, 30, 40, 50, 70 (Pivot Fixed), 90, 80 ]"
        },
        {
          stepNumber: 2,
          title: "Sort Sub-partitions",
          description: "Recursively sort left partition [10, 30, 40, 50] and right partition [90, 80].",
          visualState: "[ 10, 30, 40, 50, 70, 80, 90 ]"
        }
      ],
      conclusion: "Fast in-place partitioning completes sort."
    },
    pros: [
      "Very fast practical sorting algorithm in CPU cache due to localized memory access.",
      "In-place sorting with O(log N) stack depth."
    ],
    cons: [
      "Unstable sort.",
      "Worst case O(N²) if poor pivot selection occurs (e.g. already sorted array with end pivot)."
    ],
    applications: [
      "Standard library implementations (std::sort in C++, qsort in C).",
      "High performance in-memory sorting."
    ]
  },

  HeapSort: {
    id: "HeapSort",
    name: "Heap Sort",
    category: "Sorting",
    summary: "Converts array into a Max-Heap binary tree where root is maximum value. Repeatedly extracts max root to end and restores heap property.",
    realWorldAnalogy: "Priority queue processing; highest priority candidate at top of heap tree is repeatedly awarded top rank and moved to output list.",
    coreIntuition: "Binary Max-Heap tree guarantees max element at index 0 in O(1) lookups.",
    stepByStepLogic: [
      "Build Max-Heap tree structure from input array.",
      "Swap root element (index 0, largest) with last element of array.",
      "Reduce active heap size by 1.",
      "Heapify root node to restore Max-Heap property.",
      "Repeat steps 2 to 4 until heap size reduces to 1."
    ],
    complexity: {
      bestTime: "O(N log N)",
      averageTime: "O(N log N)",
      worstTime: "O(N log N)",
      spaceComplexity: "O(1)",
      stable: false,
      inPlace: true
    },
    example: {
      title: "Sorting Array [ 4, 10, 3, 5, 1 ]",
      initialInput: "[ 4, 10, 3, 5, 1 ]",
      steps: [
        {
          stepNumber: 1,
          title: "Build Max-Heap",
          description: "Rearrange array into Max-Heap. Max element 10 becomes root.",
          visualState: "Heap Array: [ 10, 5, 3, 4, 1 ]"
        },
        {
          stepNumber: 2,
          title: "Extract Max Root",
          description: "Swap 10 with 1 -> [1, 5, 3, 4, 10]. Heapify root -> [5, 4, 3, 1, 10].",
          visualState: "Active Heap: [ 5, 4, 3, 1 ] | Sorted: [ 10 ]"
        },
        {
          stepNumber: 3,
          title: "Repeat Extractions",
          description: "Extract 5, then 4, then 3.",
          visualState: "Result: [ 1, 3, 4, 5, 10 ]"
        }
      ],
      conclusion: "Sorted in-place with guaranteed O(N log N) bounds."
    },
    pros: [
      "Guaranteed O(N log N) time complexity in all cases.",
      "In-place memory usage O(1)."
    ],
    cons: [
      "Unstable sort.",
      "Slower than QuickSort in practice due to poor cache locality."
    ],
    applications: [
      "Embedded systems with strict O(N log N) time and O(1) space limits.",
      "Order statistics (finding top K items)."
    ]
  },

  CountingSort: {
    id: "CountingSort",
    name: "Counting Sort",
    category: "Sorting",
    summary: "Non-comparison integer sorting algorithm that counts frequencies of distinct key values and uses prefix sums to place items in exact sorted indices.",
    realWorldAnalogy: "Tallying election votes or student grades (A, B, C, D); counting tally marks per grade and writing them out in sorted order.",
    coreIntuition: "Knowing exact frequency counts allows direct calculation of sorted index positions without pairwise comparisons.",
    stepByStepLogic: [
      "Find maximum value K in array to size frequency count array.",
      "Count frequency of each element and store in Count[value].",
      "Compute prefix cumulative sums: Count[i] = Count[i] + Count[i-1].",
      "Iterate original array backward, place each element into Output[Count[arr[i]] - 1] and decrement Count[arr[i]].",
      "Copy Output array back to original array."
    ],
    complexity: {
      bestTime: "O(N + K)",
      averageTime: "O(N + K)",
      worstTime: "O(N + K)",
      spaceComplexity: "O(N + K)",
      stable: true,
      inPlace: false
    },
    example: {
      title: "Sorting Array [ 4, 2, 2, 8, 3, 3, 1 ]",
      initialInput: "[ 4, 2, 2, 8, 3, 3, 1 ]",
      steps: [
        {
          stepNumber: 1,
          title: "Frequency Counting",
          description: "Count occurrences: 1: 1 time, 2: 2 times, 3: 2 times, 4: 1 time, 8: 1 time.",
          visualState: "Count Array: [0, 1, 2, 2, 1, 0, 0, 0, 1]"
        },
        {
          stepNumber: 2,
          title: "Prefix Sum & Output Placement",
          description: "Use cumulative counts to place elements into output indices.",
          visualState: "Output Array: [ 1, 2, 2, 3, 3, 4, 8 ]"
        }
      ],
      conclusion: "Linear time sort without single comparison."
    },
    pros: [
      "Linear time complexity O(N + K) when key range K is small.",
      "Stable sorting."
    ],
    cons: [
      "Requires integer keys with known finite range K.",
      "High extra space O(N + K) if K is very large."
    ],
    applications: [
      "Sub-routine inside Radix Sort.",
      "Sorting exam scores, ages, or small integer categories."
    ]
  },

  RadixSort: {
    id: "RadixSort",
    name: "Radix Sort",
    category: "Sorting",
    summary: "Sorts integers digit-by-digit from least significant digit (LSD) to most significant digit (MSD) using a stable sub-sort (Counting Sort).",
    realWorldAnalogy: "Sorting mail index cards by zip code: first group by last digit, then 2nd to last, up to the 1st digit.",
    coreIntuition: "Sorting digit positions from right to left maintains relative ordering established by lower digits.",
    stepByStepLogic: [
      "Find maximum number to determine maximum digit count D.",
      "Initialize digit position Exp = 1 (1s, 10s, 100s...).",
      "Perform stable Counting Sort on numbers based on digit value at Exp position.",
      "Multiply Exp by 10.",
      "Repeat until all D digit positions have been processed."
    ],
    complexity: {
      bestTime: "O(D · (N + K))",
      averageTime: "O(D · (N + K))",
      worstTime: "O(D · (N + K))",
      spaceComplexity: "O(N + K)",
      stable: true,
      inPlace: false
    },
    example: {
      title: "Sorting Array [ 170, 45, 75, 90, 802, 24, 2, 66 ]",
      initialInput: "[ 170, 45, 75, 90, 802, 24, 2, 66 ]",
      steps: [
        {
          stepNumber: 1,
          title: "Pass 1: 1s Digit",
          description: "Sort based on units digit (170, 90 have 0; 802, 2 have 2...)",
          visualState: "[ 170, 90, 802, 2, 24, 45, 75, 66 ]"
        },
        {
          stepNumber: 2,
          title: "Pass 2: 10s Digit",
          description: "Sort based on tens digit.",
          visualState: "[ 802, 2, 24, 45, 66, 170, 75, 90 ]"
        },
        {
          stepNumber: 3,
          title: "Pass 3: 100s Digit",
          description: "Sort based on hundreds digit.",
          visualState: "[ 2, 24, 45, 66, 75, 90, 170, 802 ]"
        }
      ],
      conclusion: "Linear digit passes complete sort."
    },
    pros: [
      "Faster than O(N log N) comparison sorts when digit count D is small.",
      "Stable sorting algorithm."
    ],
    cons: [
      "Requires extra space O(N + K).",
      "Limited to numbers, strings, or fixed length keys."
    ],
    applications: [
      "Sorting fixed length strings, IP addresses, or 64-bit integer keys."
    ]
  },

  BucketSort: {
    id: "BucketSort",
    name: "Bucket Sort",
    category: "Sorting",
    summary: "Distributes elements into range buckets based on values, individually sorts each bucket, and concatenates results.",
    realWorldAnalogy: "Sorting mail letters into post office boxes by area code, then sorting mail inside each box before final delivery.",
    coreIntuition: "Scattering elements into localized value intervals reduces overall sorting work.",
    stepByStepLogic: [
      "Create N empty bucket containers covering value range.",
      "Iterate array elements and scatter into appropriate bucket based on value.",
      "Sort each individual bucket (e.g. using Insertion Sort).",
      "Gather sorted elements from all buckets in sequential order into output array."
    ],
    complexity: {
      bestTime: "O(N + K)",
      averageTime: "O(N + K)",
      worstTime: "O(N²)",
      spaceComplexity: "O(N + K)",
      stable: true,
      inPlace: false
    },
    example: {
      title: "Sorting Floating Point Array [ 0.78, 0.17, 0.39, 0.26, 0.72, 0.94 ]",
      initialInput: "[ 0.78, 0.17, 0.39, 0.26, 0.72, 0.94 ]",
      steps: [
        {
          stepNumber: 1,
          title: "Scatter into Buckets",
          description: "Bucket [0.1..0.2]: [0.17, 0.26] | Bucket [0.3..0.4]: [0.39] | Bucket [0.7..0.8]: [0.72, 0.78] | Bucket [0.9..1.0]: [0.94]",
          visualState: "Buckets populated."
        },
        {
          stepNumber: 2,
          title: "Sort & Gather",
          description: "Sort individual buckets and combine.",
          visualState: "[ 0.17, 0.26, 0.39, 0.72, 0.78, 0.94 ]"
        }
      ],
      conclusion: "Linear average time sorting on uniform floats."
    },
    pros: [
      "Linear time O(N) when input elements are uniformly distributed across range."
    ],
    cons: [
      "Degenerates to O(N²) if all elements cluster into a single bucket."
    ],
    applications: [
      "Sorting floating point numbers in range [0, 1).",
      "Histogram calculations."
    ]
  },

  ShellSort: {
    id: "ShellSort",
    name: "Shell Sort",
    category: "Sorting",
    summary: "Generalization of Insertion Sort that compares items far apart using decreasing gap intervals (N/2, N/4... 1).",
    realWorldAnalogy: "Sorting cards in coarse passes first (comparing cards 4 slots apart) before fine-tuning with 1-gap insertion sort.",
    coreIntuition: "Exchange distant out-of-order elements quickly to make array nearly sorted before final 1-gap pass.",
    stepByStepLogic: [
      "Choose initial gap size H (e.g. H = N / 2).",
      "Perform H-sorted insertion sort on sub-lists of elements spaced H apart.",
      "Reduce gap size H (e.g. H = H / 2).",
      "Repeat until gap size H = 1.",
      "Perform final standard 1-gap Insertion Sort on nearly sorted array."
    ],
    complexity: {
      bestTime: "O(N log N)",
      averageTime: "O(N^(4/3))",
      worstTime: "O(N²)",
      spaceComplexity: "O(1)",
      stable: false,
      inPlace: true
    },
    example: {
      title: "Sorting Array [ 35, 33, 42, 10, 14, 19, 27, 44 ] with Initial Gap = 4",
      initialInput: "[ 35, 33, 42, 10, 14, 19, 27, 44 ]",
      steps: [
        {
          stepNumber: 1,
          title: "Gap = 4 Pass",
          description: "Compare pairs 4 slots apart (35 & 14 -> swap; 33 & 19 -> swap...).",
          visualState: "[ 14, 19, 27, 10, 35, 33, 42, 44 ]"
        },
        {
          stepNumber: 2,
          title: "Gap = 2 Pass",
          description: "Compare pairs 2 slots apart.",
          visualState: "[ 14, 10, 27, 19, 35, 33, 42, 44 ]"
        },
        {
          stepNumber: 3,
          title: "Gap = 1 Pass",
          description: "Final Insertion Sort pass on nearly sorted array.",
          visualState: "[ 10, 14, 19, 27, 33, 35, 42, 44 ]"
        }
      ],
      conclusion: "Array sorted with far fewer element shifts."
    },
    pros: [
      "In-place O(1) memory usage.",
      "Significantly faster than standard Insertion Sort without recursive call overhead."
    ],
    cons: [
      "Unstable sort.",
      "Time complexity highly dependent on gap sequence chosen."
    ],
    applications: [
      "Embedded microcontrollers with tiny call stack limits."
    ]
  },

  CocktailSort: {
    id: "CocktailSort",
    name: "Cocktail Sort",
    category: "Sorting",
    summary: "Bi-directional variation of Bubble Sort that traverses forward pushing max values right, then backward pushing min values left.",
    realWorldAnalogy: "Shaking a cocktail mixer back and forth; heavy elements settle right while light elements float left on alternating passes.",
    coreIntuition: "Solves the 'turtles' problem in Bubble Sort where small elements near the end move very slowly to the front.",
    stepByStepLogic: [
      "Perform forward left-to-right pass comparing adjacent elements; swap if left > right. Max value reaches end.",
      "Reduce right boundary index by 1.",
      "Perform backward right-to-left pass comparing adjacent elements; swap if right < left. Min value reaches start.",
      "Increase left boundary index by 1.",
      "Repeat alternating passes until no swaps occur."
    ],
    complexity: {
      bestTime: "O(N)",
      averageTime: "O(N²)",
      worstTime: "O(N²)",
      spaceComplexity: "O(1)",
      stable: true,
      inPlace: true
    },
    example: {
      title: "Sorting Array [ 5, 1, 4, 2, 8 ]",
      initialInput: "[ 5, 1, 4, 2, 8 ]",
      steps: [
        {
          stepNumber: 1,
          title: "Forward Pass (Left to Right)",
          description: "Swap 5&1, 5&4, 5&2. Max 8 remains end.",
          visualState: "[ 1, 4, 2, 5, 8 (Fixed) ]"
        },
        {
          stepNumber: 2,
          title: "Backward Pass (Right to Left)",
          description: "Compare backward: Swap 4&2 -> [1, 2, 4, 5, 8]. Min 1 fixed at start.",
          visualState: "[ 1 (Fixed), 2, 4, 5, 8 ]"
        }
      ],
      conclusion: "Bi-directional passes quickly settle elements."
    },
    pros: [
      "Slightly faster than Bubble Sort for lists with small elements near the end.",
      "Stable and in-place O(1)."
    ],
    cons: [
      "O(N²) quadratic average runtime."
    ],
    applications: [
      "Educational demonstrations of bi-directional sorting."
    ]
  }
};

export function getAlgorithmTheory(algoId: string): AlgorithmTheoryData {
  const found = ALGORITHM_THEORY_DATA[algoId];
  if (found) return found;

  // Fallback if ID case differs
  const key = Object.keys(ALGORITHM_THEORY_DATA).find(
    (k) => k.toLowerCase() === algoId.toLowerCase()
  );
  return key ? ALGORITHM_THEORY_DATA[key] : ALGORITHM_THEORY_DATA.LinearSearch;
}
