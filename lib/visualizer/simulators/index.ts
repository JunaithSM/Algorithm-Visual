import { registerSimulator, getSimulator, getAllSimulators } from "./registry";

// Searching Simulators
import { linearSearchSimulator } from "./searching/linearSearch";
import { binarySearchSimulator } from "./searching/binarySearch";
import { interpolationSearchSimulator } from "./searching/interpolationSearch";
import { jumpSearchSimulator } from "./searching/jumpSearch";
import { exponentialSearchSimulator } from "./searching/exponentialSearch";

// Sorting Simulators
import { bubbleSortSimulator } from "./sorting/bubbleSort";
import { selectionSortSimulator } from "./sorting/selectionSort";
import { insertionSortSimulator } from "./sorting/insertionSort";
import { mergeSortSimulator } from "./sorting/mergeSort";
import { quickSortSimulator } from "./sorting/quickSort";
import { heapSortSimulator } from "./sorting/heapSort";
import { countingSortSimulator } from "./sorting/countingSort";
import { radixSortSimulator } from "./sorting/radixSort";
import { bucketSortSimulator } from "./sorting/bucketSort";
import { shellSortSimulator } from "./sorting/shellSort";
import { cocktailSortSimulator } from "./sorting/cocktailSort";

// Register all 16 simulators
registerSimulator(linearSearchSimulator);
registerSimulator(binarySearchSimulator);
registerSimulator(interpolationSearchSimulator);
registerSimulator(jumpSearchSimulator);
registerSimulator(exponentialSearchSimulator);

registerSimulator(bubbleSortSimulator);
registerSimulator(selectionSortSimulator);
registerSimulator(insertionSortSimulator);
registerSimulator(mergeSortSimulator);
registerSimulator(quickSortSimulator);
registerSimulator(heapSortSimulator);
registerSimulator(countingSortSimulator);
registerSimulator(radixSortSimulator);
registerSimulator(bucketSortSimulator);
registerSimulator(shellSortSimulator);
registerSimulator(cocktailSortSimulator);

export { registerSimulator, getSimulator, getAllSimulators };
