// ================================
// DOM ELEMENTS
// ================================
const inputArray = document.getElementById('inputArray');
const algorithmSelect = document.getElementById('algorithm');
const speedRange = document.getElementById('speedRange');
const speedLabel = document.getElementById('speedLabel');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const generateBtn = document.getElementById('generateBtn');
const arrayContainer = document.getElementById('arrayContainer');
const bubbleContainer = document.getElementById('bubbleContainer');
const bucketContainer = document.getElementById('bucketContainer');
const heapContainer = document.getElementById('heapContainer');
const algorithmInfo = document.getElementById('algorithmInfo');
const comparisonsEl = document.getElementById('comparisons');
const swapsEl = document.getElementById('swaps');
const arraySizeEl = document.getElementById('arraySize');

// ================================
// STATE VARIABLES
// ================================
let array = [];
let animations = [];
let speed = 500;
let animationId = null;
let isPaused = false;
let currentStep = 0;
let comparisons = 0;
let swaps = 0;
let bubbleInterval = null;

// ================================
// ALGORITHM INFORMATION
// ================================
const algoInfo = {
  bubbleSort: {
    name: "Bubble Sort 🫧",
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order. Named for the way smaller elements 'bubble' to the top!",
    complexity: "Time: O(n²) | Space: O(1)",
    realWorld: "📚 Real-world: Used in educational settings to teach sorting concepts. Practical for small datasets or nearly sorted data."
  },
  selectionSort: {
    name: "Selection Sort",
    description: "Divides the input into sorted and unsorted regions, repeatedly selecting the smallest element from unsorted and moving it to sorted.",
    complexity: "Time: O(n²) | Space: O(1)",
    realWorld: "🎯 Real-world: Useful when memory writes are costly. Used in systems with limited memory or when swaps are expensive operations."
  },
  insertionSort: {
    name: "Insertion Sort",
    description: "Builds the final sorted array one item at a time, inserting each element into its proper position.",
    complexity: "Time: O(n²) | Space: O(1)",
    realWorld: "🃏 Real-world: Sorting cards in your hand, online sorting when data arrives in real-time, efficient for small datasets."
  },
  mergeSort: {
    name: "Merge Sort",
    description: "Divides the array into halves, recursively sorts them, and merges the sorted halves back together.",
    complexity: "Time: O(n log n) | Space: O(n)",
    realWorld: "📊 Real-world: External sorting for large files, sorting linked lists, parallel processing systems, and database operations."
  },
  quickSort: {
    name: "Quick Sort",
    description: "Selects a pivot element, partitions the array around it, and recursively sorts the subarrays.",
    complexity: "Time: O(n log n) avg | Space: O(log n)",
    realWorld: "⚡ Real-world: Default sorting in many programming languages (C++, Java), file systems, and general-purpose sorting."
  },
  heapSort: {
    name: "Heap Sort",
    description: "Builds a max heap from the array, then repeatedly extracts the maximum element and rebuilds the heap.",
    complexity: "Time: O(n log n) | Space: O(1)",
    realWorld: "🏆 Real-world: Priority queues, job scheduling systems, operating system task management, and finding k largest elements."
  },
  countingSort: {
    name: "Counting Sort",
    description: "Counts the occurrences of each element and uses arithmetic to determine positions in the output array.",
    complexity: "Time: O(n + k) | Space: O(k)",
    realWorld: "📈 Real-world: Sorting exam scores, histogram generation, voting systems where range is limited."
  },
  radixSort: {
    name: "Radix Sort",
    description: "Sorts numbers by processing individual digits, sorting from least significant to most significant digit.",
    complexity: "Time: O(d × n) | Space: O(n + k)",
    realWorld: "📞 Real-world: Sorting phone numbers, credit card numbers, zip codes, and other fixed-length numerical data."
  },
  bucketSort: {
    name: "Bucket Sort",
    description: "Distributes elements into buckets, sorts individual buckets, and concatenates them to get the sorted array.",
    complexity: "Time: O(n + k) | Space: O(n + k)",
    realWorld: "🎲 Real-world: Sorting uniformly distributed data like floating-point numbers, hash tables, and parallel sorting."
  }
};

// ================================
// BUBBLE ANIMATION FUNCTIONS
// ================================
function createBubble() {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  
  // Random size between 20px and 60px
  const size = Math.random() * 40 + 20;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  
  // Random horizontal position
  bubble.style.left = `${Math.random() * 100}%`;
  
  // Start from bottom
  bubble.style.bottom = '-100px';
  
  // Random animation duration
  const duration = Math.random() * 3 + 3; // 3-6 seconds
  bubble.style.animationDuration = `${duration}s`;
  
  // Random delay
  const delay = Math.random() * 0.5;
  bubble.style.animationDelay = `${delay}s`;
  
  bubbleContainer.appendChild(bubble);
  
  // Remove bubble after animation
  setTimeout(() => {
    if (bubble.parentNode) {
      bubble.remove();
    }
  }, (duration + delay) * 1000);
}

function startBubbleAnimation() {
  bubbleContainer.innerHTML = '';
  // Create bubbles at intervals
  bubbleInterval = setInterval(() => {
    createBubble();
  }, 300);
  
  // Create initial burst of bubbles
  for (let i = 0; i < 5; i++) {
    setTimeout(() => createBubble(), i * 100);
  }
}

function stopBubbleAnimation() {
  if (bubbleInterval) {
    clearInterval(bubbleInterval);
    bubbleInterval = null;
  }
  // Clear existing bubbles
  setTimeout(() => {
    bubbleContainer.innerHTML = '';
  }, 1000);
}

function createSwapBubbles(index1, index2) {
  const bars = arrayContainer.querySelectorAll('.array-bar');
  if (bars[index1] && bars[index2]) {
    const rect1 = bars[index1].getBoundingClientRect();
    const rect2 = bars[index2].getBoundingClientRect();
    const containerRect = arrayContainer.getBoundingClientRect();
    
    // Create bubbles at swap positions
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        // Bubble at first position
        const bubble1 = document.createElement('div');
        bubble1.className = 'bubble pop';
        const size = Math.random() * 30 + 20;
        bubble1.style.width = `${size}px`;
        bubble1.style.height = `${size}px`;
        bubble1.style.left = `${rect1.left - containerRect.left + rect1.width / 2}px`;
        bubble1.style.bottom = `${containerRect.height - (rect1.bottom - containerRect.top)}px`;
        bubbleContainer.appendChild(bubble1);
        
        // Bubble at second position
        const bubble2 = document.createElement('div');
        bubble2.className = 'bubble pop';
        bubble2.style.width = `${size}px`;
        bubble2.style.height = `${size}px`;
        bubble2.style.left = `${rect2.left - containerRect.left + rect2.width / 2}px`;
        bubble2.style.bottom = `${containerRect.height - (rect2.bottom - containerRect.top)}px`;
        bubbleContainer.appendChild(bubble2);
        
        setTimeout(() => {
          bubble1.remove();
          bubble2.remove();
        }, 300);
      }, i * 50);
    }
  }
}

// ================================
// EVENT LISTENERS
// ================================
speedRange.addEventListener('input', () => {
  speed = parseInt(speedRange.value);
  const labels = ['Very Fast', 'Fast', 'Medium', 'Slow', 'Very Slow'];
  const index = Math.floor((speed - 50) / 487.5);
  speedLabel.textContent = labels[Math.min(index, 4)];
});

algorithmSelect.addEventListener('change', () => {
  const algo = algorithmSelect.value;
  
  // Hide all special containers
  bucketContainer.style.display = 'none';
  heapContainer.style.display = 'none';
  arrayContainer.style.display = 'flex';
  
  if (algo && algoInfo[algo]) {
    const info = algoInfo[algo];
    algorithmInfo.innerHTML = `
      <div class="info-card">
        <h3>${info.name}</h3>
        <p>${info.description}</p>
        <div class="complexity">${info.complexity}</div>
        <div class="real-world">${info.realWorld}</div>
      </div>
    `;
  } else {
    algorithmInfo.innerHTML = '';
  }
});

generateBtn.addEventListener('click', () => {
  const size = Math.floor(Math.random() * 10) + 8;
  const randomArray = Array.from({length: size}, () => Math.floor(Math.random() * 90) + 10);
  inputArray.value = randomArray.join(', ');
});

// ================================
// RENDERING FUNCTIONS
// ================================
function renderArray(arr, comparing = [], swapping = [], sorted = [], pivot = []) {
  arrayContainer.innerHTML = '';
  const maxVal = Math.max(...arr);
  arr.forEach((val, idx) => {
    const bar = document.createElement('div');
    bar.className = 'array-bar';
    bar.style.height = `${(val / maxVal) * 280}px`;
    bar.textContent = val;
    
    if (sorted.includes(idx)) bar.classList.add('sorted');
    else if (pivot.includes(idx)) bar.classList.add('pivot');
    else if (swapping.includes(idx)) bar.classList.add('swapping');
    else if (comparing.includes(idx)) bar.classList.add('comparing');
    
    arrayContainer.appendChild(bar);
  });
}

function renderBuckets(buckets, highlightBucket = -1) {
  bucketContainer.innerHTML = '';
  buckets.forEach((bucket, idx) => {
    const bucketDiv = document.createElement('div');
    bucketDiv.className = 'bucket';
    if (idx === highlightBucket) {
      bucketDiv.style.borderColor = '#e74c3c';
      bucketDiv.style.transform = 'scale(1.05)';
    }
    
    const label = document.createElement('div');
    label.className = 'bucket-label';
    label.textContent = `B${idx}`;
    bucketDiv.appendChild(label);
    
    bucket.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'bucket-item';
      itemDiv.textContent = item;
      bucketDiv.appendChild(itemDiv);
    });
    
    bucketContainer.appendChild(bucketDiv);
  });
}

function renderHeap(arr, active = -1, comparing = []) {
  heapContainer.innerHTML = '';
  if (arr.length === 0) return;

  const levels = Math.ceil(Math.log2(arr.length + 1));
  let index = 0;

  for (let level = 0; level < levels; level++) {
    const levelDiv = document.createElement('div');
    levelDiv.className = 'heap-level';
    
    const nodesInLevel = Math.pow(2, level);
    const nodesToShow = Math.min(nodesInLevel, arr.length - index);
    
    for (let i = 0; i < nodesToShow; i++) {
      const nodeDiv = document.createElement('div');
      nodeDiv.className = 'heap-node';
      nodeDiv.textContent = arr[index];
      
      if (index === active) {
        nodeDiv.classList.add('active');
      } else if (comparing.includes(index)) {
        nodeDiv.classList.add('comparing');
      }
      
      levelDiv.appendChild(nodeDiv);
      index++;
    }
    
    heapContainer.appendChild(levelDiv);
  }
}

function parseInput() {
  const input = inputArray.value.trim();
  if (!input) {
    alert('Please enter some numbers!');
    return null;
  }
  const arr = input.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
  if (arr.length === 0) {
    alert('Please enter valid numbers!');
    return null;
  }
  return arr;
}

// ================================
// SORTING ALGORITHMS
// ================================
async function bubbleSort(arr) {
  const steps = [];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({type: 'compare', indices: [j, j + 1]});
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({type: 'swap', indices: [j, j + 1], array: [...arr]});
      }
    }
    steps.push({type: 'sorted', index: n - i - 1});
  }
  steps.push({type: 'sorted', index: 0});
  return steps;
}

async function selectionSort(arr) {
  const steps = [];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      steps.push({type: 'compare', indices: [minIdx, j]});
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({type: 'swap', indices: [i, minIdx], array: [...arr]});
    }
    steps.push({type: 'sorted', index: i});
  }
  steps.push({type: 'sorted', index: n - 1});
  return steps;
}

async function insertionSort(arr) {
  const steps = [];
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      steps.push({type: 'compare', indices: [j, j + 1]});
      arr[j + 1] = arr[j];
      steps.push({type: 'swap', indices: [j, j + 1], array: [...arr]});
      j--;
    }
    arr[j + 1] = key;
    steps.push({type: 'update', array: [...arr]});
  }
  for (let i = 0; i < arr.length; i++) {
    steps.push({type: 'sorted', index: i});
  }
  return steps;
}

async function mergeSort(arr) {
  const steps = [];

  function merge(start, mid, end) {
    const left = arr.slice(start, mid);
    const right = arr.slice(mid, end);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
      steps.push({type: 'compare', indices: [k, k]});
      if (left[i] <= right[j]) {
        arr[k] = left[i++];
      } else {
        arr[k] = right[j++];
      }
      steps.push({type: 'update', array: [...arr]});
      k++;
    }
    while (i < left.length) {
      arr[k++] = left[i++];
      steps.push({type: 'update', array: [...arr]});
    }
    while (j < right.length) {
      arr[k++] = right[j++];
      steps.push({type: 'update', array: [...arr]});
    }
  }

  function mergeSortHelper(start, end) {
    if (end - start <= 1) return;
    const mid = Math.floor((start + end) / 2);
    mergeSortHelper(start, mid);
    mergeSortHelper(mid, end);
    merge(start, mid, end);
  }

  mergeSortHelper(0, arr.length);
  for (let i = 0; i < arr.length; i++) {
    steps.push({type: 'sorted', index: i});
  }
  return steps;
}

async function quickSort(arr) {
  const steps = [];

  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({type: 'compare', indices: [j, high]});
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({type: 'swap', indices: [i, j], array: [...arr]});
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({type: 'swap', indices: [i + 1, high], array: [...arr]});
    return i + 1;
  }

  function quickSortHelper(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  }

  quickSortHelper(0, arr.length - 1);
  for (let i = 0; i < arr.length; i++) {
    steps.push({type: 'sorted', index: i});
  }
  return steps;
}

async function heapSort(arr) {
  const steps = [];
  const n = arr.length;

  function heapify(size, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    steps.push({type: 'heap', array: [...arr], active: i});

    if (left < size) {
      steps.push({type: 'compare', indices: [largest, left]});
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      steps.push({type: 'compare', indices: [largest, right]});
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({type: 'swap', indices: [i, largest], array: [...arr]});
      heapify(size, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push({type: 'swap', indices: [0, i], array: [...arr]});
    steps.push({type: 'sorted', index: i});
    heapify(i, 0);
  }
  
  steps.push({type: 'sorted', index: 0});
  return steps;
}

async function countingSort(arr) {
  const steps = [];
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(arr.length);

  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
    steps.push({type: 'compare', indices: [i]});
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
    arr[i] = output[i];
    steps.push({type: 'update', array: [...output]});
  }

  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
  }
  steps.push({type: 'update', array: [...arr]});
  
  for (let i = 0; i < arr.length; i++) {
    steps.push({type: 'sorted', index: i});
  }
  return steps;
}

async function radixSort(arr) {
  const steps = [];
  const max = Math.max(...arr);
  
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array(arr.length).fill(0);
    const count = new Array(10).fill(0);

    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      steps.push({type: 'compare', indices: [i]});
    }

    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
      steps.push({type: 'update', array: [...output]});
    }

    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
    }
    steps.push({type: 'update', array: [...arr]});
  }

  for (let i = 0; i < arr.length; i++) {
    steps.push({type: 'sorted', index: i});
  }
  return steps;
}

async function bucketSort(arr) {
  const steps = [];
  const n = arr.length;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const bucketCount = Math.min(n, 10);
  const buckets = Array.from({length: bucketCount}, () => []);

  for (let i = 0; i < n; i++) {
    const bucketIndex = Math.floor(((arr[i] - min) / (max - min + 1)) * bucketCount);
    const idx = Math.min(bucketIndex, bucketCount - 1);
    buckets[idx].push(arr[i]);
    steps.push({type: 'bucket-add', buckets: buckets.map(b => [...b]), element: arr[i], bucketIndex: idx});
  }

  let index = 0;
  for (let i = 0; i < buckets.length; i++) {
    buckets[i].sort((a, b) => a - b);
    steps.push({type: 'bucket-sort', buckets: buckets.map(b => [...b]), bucketIndex: i});
    
    for (let j = 0; j < buckets[i].length; j++) {
      arr[index] = buckets[i][j];
      steps.push({type: 'bucket-collect', array: [...arr], index: index});
      index++;
    }
  }

  for (let i = 0; i < arr.length; i++) {
    steps.push({type: 'sorted', index: i});
  }
  return steps;
}

// ================================
// ANIMATION RUNNER
// ================================
async function runAnimation() {
  const sortedIndices = [];
  const algo = algorithmSelect.value;
  
  // Start bubble animation for bubble sort
  if (algo === 'bubbleSort') {
    startBubbleAnimation();
  }
  
  for (let i = currentStep; i < animations.length && !isPaused; i++) {
    currentStep = i;
    const step = animations[i];

    if (step.type === 'compare') {
      comparisons++;
      comparisonsEl.textContent = comparisons;
      if (algo === 'heapSort') {
        renderHeap(array, -1, step.indices);
      } else {
        renderArray(array, step.indices, [], sortedIndices);
      }
    } else if (step.type === 'swap') {
      swaps++;
      swapsEl.textContent = swaps;
      array = [...step.array];
      
      // Create bubble pop effect for bubble sort swaps
      if (algo === 'bubbleSort') {
        createSwapBubbles(step.indices[0], step.indices[1]);
      }
      
      if (algo === 'heapSort') {
        renderHeap(array, -1, step.indices);
      } else {
        renderArray(array, [], step.indices, sortedIndices);
      }
    } else if (step.type === 'update') {
      array = [...step.array];
      renderArray(array, [], [], sortedIndices);
    } else if (step.type === 'sorted') {
      sortedIndices.push(step.index);
      if (algo === 'heapSort') {
        renderArray(array, [], [], sortedIndices);
      } else {
        renderArray(array, [], [], sortedIndices);
      }
    } else if (step.type === 'heap') {
      array = [...step.array];
      renderHeap(array, step.active, []);
    } else if (step.type === 'bucket-add') {
      bucketContainer.style.display = 'flex';
      arrayContainer.style.display = 'flex';
      renderBuckets(step.buckets, step.bucketIndex);
    } else if (step.type === 'bucket-sort') {
      renderBuckets(step.buckets, step.bucketIndex);
    } else if (step.type === 'bucket-collect') {
      array = [...step.array];
      renderArray(array, [], [step.index], sortedIndices);
      renderBuckets(animations[i-1].buckets || []);
    }

    await new Promise(resolve => {
      animationId = setTimeout(resolve, speed);
    });

    if (isPaused) break;
  }

  // Stop bubble animation when done
  if (currentStep >= animations.length - 1) {
    stopBubbleAnimation();
    toggleButtons(false);
  }
}

function toggleButtons(sorting) {
  startBtn.disabled = sorting;
  pauseBtn.disabled = !sorting;
  resetBtn.disabled = !sorting;
  generateBtn.disabled = sorting;
  inputArray.disabled = sorting;
  algorithmSelect.disabled = sorting;
}

// ================================
// BUTTON EVENT HANDLERS
// ================================
startBtn.addEventListener('click', async () => {
  if (currentStep > 0 && currentStep < animations.length) {
    isPaused = false;
    pauseBtn.textContent = 'Pause';
    toggleButtons(true);
    runAnimation();
    return;
  }

  const input = parseInput();
  if (!input) return;

  const algo = algorithmSelect.value;
  if (!algo) {
    alert('Please select an algorithm!');
    return;
  }

  array = [...input];
  comparisons = 0;
  swaps = 0;
  currentStep = 0;
  
  comparisonsEl.textContent = '0';
  swapsEl.textContent = '0';
  arraySizeEl.textContent = array.length;

  renderArray(array);

  const sortFunctions = {
    bubbleSort,
    selectionSort,
    insertionSort,
    mergeSort,
    quickSort,
    heapSort,
    countingSort,
    radixSort,
    bucketSort
  };

  animations = await sortFunctions[algo]([...array]);
  
  if (algo === 'bucketSort') {
    bucketContainer.style.display = 'flex';
  } else if (algo === 'heapSort') {
    heapContainer.style.display = 'flex';
    arrayContainer.style.display = 'none';
  }
  
  toggleButtons(true);
  isPaused = false;
  runAnimation();
});

pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
  if (!isPaused) {
    runAnimation();
  } else {
    // Pause bubble animation
    const algo = algorithmSelect.value;
    if (algo === 'bubbleSort') {
      stopBubbleAnimation();
    }
  }
});

resetBtn.addEventListener('click', () => {
  if (animationId) {
    clearTimeout(animationId);
    animationId = null;
  }
  stopBubbleAnimation();
  isPaused = false;
  currentStep = 0;
  animations = [];
  comparisons = 0;
  swaps = 0;
  comparisonsEl.textContent = '0';
  swapsEl.textContent = '0';
  arrayContainer.innerHTML = '';
  bucketContainer.innerHTML = '';
  heapContainer.innerHTML = '';
  bubbleContainer.innerHTML = '';
  bucketContainer.style.display = 'none';
  heapContainer.style.display = 'none';
  arrayContainer.style.display = 'flex';
  pauseBtn.textContent = 'Pause';
  toggleButtons(false);
});

// ================================
// INITIALIZATION
// ================================
generateBtn.click();
toggleButtons(false);