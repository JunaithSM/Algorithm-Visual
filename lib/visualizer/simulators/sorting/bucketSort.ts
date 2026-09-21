import { AlgorithmSimulator, Step } from "../types";
import { findLineNumber } from "../utils";

export const bucketSortSimulator: AlgorithmSimulator = {
  id: "BucketSort",
  category: "Sorting",
  generateSteps(inputArray, _target, code, startLineNumber) {
    const steps: Step[] = [];
    let stepCount = 1;
    const nums = [...inputArray];
    const n = nums.length;

    if (startLineNumber && startLineNumber > 0) {
      steps.push({
        stepNumber: stepCount++,
        lineNumber: startLineNumber,
        description: `Driver Call: Starting bucketSort on array [${nums.join(", ")}].`,
        array: [...nums],
        activeIndices: [],
        status: "idle",
        vars: { n },
      });
    }

    const lineHeader = findLineNumber(code, /(?:bucketSort|bucket_sort|BucketSort|sortArray)/i, 1);
    const lineBucketsInit = findLineNumber(code, /(?:buckets|bucketArray|bucketCount|make\(|new\s+List)/i, 2, lineHeader);
    const lineDistributeLoop = findLineNumber(code, /for\s*\(?.*(?:num|i|x|val)/i, 3, lineBucketsInit);
    const lineDistributePush = findLineNumber(code, /(?:push|append|add|buckets\[)/i, 4, lineDistributeLoop);
    const lineSortBuckets = findLineNumber(code, /(?:sort|insertionSort|Collections\.sort)/i, 5, lineDistributePush);
    const lineConcatenate = findLineNumber(code, /(?:concat|extend|copy|flat)/i, 6, lineSortBuckets);
    const lineReturn = findLineNumber(code, /return/i, 7);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineHeader,
      description: `Entering function bucketSort(nums) with ${n} elements.`,
      array: [...nums],
      activeIndices: [],
      status: "idle",
      vars: { n },
    });

    const numBuckets = Math.max(1, Math.floor(Math.sqrt(n)));
    const minVal = Math.min(...nums);
    const maxVal = Math.max(...nums);
    const range = Math.max(1, maxVal - minVal + 1);

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineBucketsInit > 0 ? lineBucketsInit : lineHeader,
      description: `Initializing ${numBuckets} empty buckets over range [${minVal} .. ${maxVal}].`,
      array: [...nums],
      activeIndices: [],
      status: "bucketing",
      vars: { numBuckets, minVal, maxVal },
    });

    const buckets: number[][] = Array.from({ length: numBuckets }, () => []);

    for (let i = 0; i < n; i++) {
      const bIdx = Math.min(numBuckets - 1, Math.floor(((nums[i] - minVal) / range) * numBuckets));
      buckets[bIdx].push(nums[i]);

      steps.push({
        stepNumber: stepCount++,
        lineNumber: lineDistributePush > 0 ? lineDistributePush : lineDistributeLoop,
        description: `Distributing element nums[${i}] = ${nums[i]} into bucket #${bIdx + 1}.`,
        array: [...nums],
        activeIndices: [i],
        status: "bucketing",
        vars: { i, val: nums[i], bucketIdx: bIdx + 1 },
      });
    }

    // Sort buckets and combine
    const sortedNums: number[] = [];
    for (let b = 0; b < numBuckets; b++) {
      if (buckets[b].length > 0) {
        steps.push({
          stepNumber: stepCount++,
          lineNumber: lineSortBuckets > 0 ? lineSortBuckets : lineDistributePush,
          description: `Sorting elements inside bucket #${b + 1}: [${buckets[b].join(", ")}].`,
          array: [...nums],
          activeIndices: [],
          status: "bucketing",
          vars: { bucketIdx: b + 1, count: buckets[b].length },
        });

        buckets[b].sort((a, b) => a - b);
        sortedNums.push(...buckets[b]);
      }
    }

    steps.push({
      stepNumber: stepCount++,
      lineNumber: lineConcatenate > 0 ? lineConcatenate : lineSortBuckets,
      description: `Concatenating sorted buckets into final sorted array: [${sortedNums.join(", ")}].`,
      array: [...sortedNums],
      activeIndices: [],
      status: "sorted",
      vars: { n },
    });

    return steps;
  },
};
