// ---------- Summarizer ----------
export const DUMMY_TRANSCRIPT = [
  { ts: '0:00', text: 'Welcome. Today we cover sorting algorithms from first principles.' },
  { ts: '0:48', text: 'We start with the divide-and-conquer idea behind Merge Sort.' },
  { ts: '2:10', text: 'Quick Sort chooses a pivot and partitions the array around it.' },
  { ts: '4:30', text: 'Heap Sort builds a max-heap, then repeatedly extracts the maximum.' },
  { ts: '6:15', text: 'We compare O(n log n) average case across all three algorithms.' },
  { ts: '8:00', text: 'Space complexity matters: Merge Sort needs O(n) extra space.' },
]

export const DUMMY_SUMMARY = {
  overview: 'This lecture introduces the three canonical O(n log n) sorting algorithms — Merge Sort, Quick Sort, and Heap Sort — and compares their time/space trade-offs.',
  keyPoints: [
    'Merge Sort: stable, O(n log n) worst-case, O(n) extra space.',
    'Quick Sort: O(n log n) average, O(log n) space, but O(n²) worst-case.',
    'Heap Sort: in-place, O(n log n) guaranteed, not stable.',
  ],
  importantTimestamps: [
    { ts: '0:48', note: 'Merge Sort intro' },
    { ts: '2:10', note: 'Quick Sort pivot strategy' },
    { ts: '4:30', note: 'Heap construction' },
  ],
  conclusion: 'Choose Quick Sort for average-case performance, Merge Sort when stability is needed, and Heap Sort for guaranteed in-place sorting.',
}

export const DUMMY_QUESTIONS = [
  {
    q: 'What is the worst-case time complexity of Quick Sort?',
    options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
    answer: 1,
  },
  {
    q: 'Which sorting algorithm is stable by default?',
    options: ['Heap Sort', 'Quick Sort', 'Merge Sort', 'Selection Sort'],
    answer: 2,
  },
  {
    q: 'Heap Sort builds which data structure first?',
    options: ['Binary Search Tree', 'Min-heap', 'Max-heap', 'Trie'],
    answer: 2,
  },
  {
    q: 'What extra space does Merge Sort require?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    answer: 2,
  },
  {
    q: 'Which algorithm uses a pivot element?',
    options: ['Merge Sort', 'Heap Sort', 'Bubble Sort', 'Quick Sort'],
    answer: 3,
  },
]

// ---------- Algorithms ----------
export type Algorithm = { slug: string; name: string; stars: number; category: string; desc: string; time: string; space: string }

export const ALGORITHMS: Algorithm[] = [
  // Sorting
  { slug: 'quick-sort', name: 'Quick Sort', stars: 5, category: 'Sorting', desc: 'Divide-and-conquer via pivot partitioning.', time: 'O(n log n) avg', space: 'O(log n)' },
  { slug: 'merge-sort', name: 'Merge Sort', stars: 5, category: 'Sorting', desc: 'Stable sort using recursive halving and merging.', time: 'O(n log n)', space: 'O(n)' },
  { slug: 'heap-sort', name: 'Heap Sort', stars: 4, category: 'Sorting', desc: 'In-place sort built on a max-heap structure.', time: 'O(n log n)', space: 'O(1)' },
  { slug: 'insertion-sort', name: 'Insertion Sort', stars: 4, category: 'Sorting', desc: 'Builds sorted array one element at a time.', time: 'O(n²)', space: 'O(1)' },
  { slug: 'bubble-sort', name: 'Bubble Sort', stars: 3, category: 'Sorting', desc: 'Repeatedly swaps adjacent out-of-order elements.', time: 'O(n²)', space: 'O(1)' },
  // Searching
  { slug: 'binary-search', name: 'Binary Search', stars: 5, category: 'Searching', desc: 'Halves the search space at each step on sorted arrays.', time: 'O(log n)', space: 'O(1)' },
  { slug: 'linear-search', name: 'Linear Search', stars: 3, category: 'Searching', desc: 'Scans every element until target is found.', time: 'O(n)', space: 'O(1)' },
  // Graph
  { slug: 'bfs', name: 'BFS', stars: 5, category: 'Graph', desc: 'Explores neighbours level by level using a queue.', time: 'O(V+E)', space: 'O(V)' },
  { slug: 'dfs', name: 'DFS', stars: 5, category: 'Graph', desc: 'Explores as deep as possible before backtracking.', time: 'O(V+E)', space: 'O(V)' },
  { slug: 'dijkstra', name: "Dijkstra's", stars: 5, category: 'Graph', desc: 'Shortest path in weighted graphs via greedy relaxation.', time: 'O((V+E) log V)', space: 'O(V)' },
  // Trees
  { slug: 'tree-traversals', name: 'Tree Traversals', stars: 5, category: 'Trees', desc: 'In-order, pre-order, and post-order DFS on trees.', time: 'O(n)', space: 'O(h)' },
  { slug: 'bst-insert-delete', name: 'BST Insert/Delete', stars: 4, category: 'Trees', desc: 'Maintains BST ordering property on mutations.', time: 'O(h)', space: 'O(1)' },
  // Dynamic Programming
  { slug: 'fibonacci-memo', name: 'Fibonacci (Memo)', stars: 5, category: 'Dynamic Programming', desc: 'Top-down memoization eliminates redundant subproblems.', time: 'O(n)', space: 'O(n)' },
  { slug: 'knapsack', name: '0/1 Knapsack', stars: 5, category: 'Dynamic Programming', desc: 'Maximize value under weight constraint via DP table.', time: 'O(nW)', space: 'O(nW)' },
  // Backtracking
  { slug: 'n-queens', name: 'N-Queens', stars: 4, category: 'Backtracking', desc: 'Place N queens on an N×N board with no conflicts.', time: 'O(n!)', space: 'O(n)' },
]

export const ALGO_CODE: Record<string, { js?: string; python?: string }> = {
  'quick-sort': {
    js: `function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;
  const p = partition(arr, lo, hi);
  quickSort(arr, lo, p - 1);
  quickSort(arr, p + 1, hi);
  return arr;
}

function partition(arr, lo, hi) {
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  return i + 1;
}`,
  },
  'binary-search': {
    python: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
  },
}

// ---------- Code Challenge ----------
export type CodeBlock = { id: string; code: string; description: string; correctIndex: number }

export const CHALLENGES: Record<string, { title: string; language: string; blocks: CodeBlock[] }> = {
  'bubble-sort-js': {
    title: 'Bubble Sort — JavaScript',
    language: 'javascript',
    blocks: [
      { id: 'b1', code: 'function bubbleSort(arr) {', description: 'Declare the function with the array parameter.', correctIndex: 0 },
      { id: 'b2', code: '  for (let i = 0; i < arr.length - 1; i++) {', description: 'Outer loop: each pass bubbles the largest unsorted element.', correctIndex: 1 },
      { id: 'b3', code: '    for (let j = 0; j < arr.length - 1 - i; j++) {', description: 'Inner loop: shrinks on each outer pass.', correctIndex: 2 },
      { id: 'b4', code: '      if (arr[j] > arr[j + 1]) {', description: 'Compare adjacent elements.', correctIndex: 3 },
      { id: 'b5', code: '        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n      }\n    }\n  }', description: 'Swap if out of order, close inner and outer loops.', correctIndex: 4 },
      { id: 'b6', code: '  return arr;\n}', description: 'Return the sorted array.', correctIndex: 5 },
    ],
  },
  'binary-search-py': {
    title: 'Binary Search — Python',
    language: 'python',
    blocks: [
      { id: 'c1', code: 'def binary_search(arr, target):', description: 'Define function with array and target.', correctIndex: 0 },
      { id: 'c2', code: '    lo, hi = 0, len(arr) - 1', description: 'Initialise two pointers.', correctIndex: 1 },
      { id: 'c3', code: '    while lo <= hi:', description: 'Loop while search space is non-empty.', correctIndex: 2 },
      { id: 'c4', code: '        mid = (lo + hi) // 2', description: 'Compute the midpoint index.', correctIndex: 3 },
      { id: 'c5', code: '        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1', description: 'Narrow search space based on comparison.', correctIndex: 4 },
      { id: 'c6', code: '    return -1', description: 'Target not found.', correctIndex: 5 },
    ],
  },
}

// ---------- AI Interviewer ----------
export const INTERVIEW_QUESTIONS: Record<string, { prompt: string; starter: string }> = {
  easy: {
    prompt: 'Implement a function to reverse a linked list.',
    starter: `# Reverse a linked list
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    # Your code here
    pass`,
  },
  medium: {
    prompt: 'Given an array of integers, find two numbers that sum to a target.',
    starter: `def two_sum(nums, target):
    # Your code here
    pass`,
  },
  hard: {
    prompt: 'Implement an LRU Cache with O(1) get and put operations.',
    starter: `class LRUCache:
    def __init__(self, capacity: int):
        # Your code here
        pass

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass`,
  },
}

export const AI_FEEDBACK: Record<string, string[]> = {
  easy: [
    "Good attempt. You've handled the base case correctly.",
    'Consider using two pointers: `prev`, `curr`, and `next_node` to iteratively reverse links.',
    'Time complexity should be O(n) — make sure you traverse the list exactly once.',
    'Remember to return `prev` at the end, not `head`.',
  ],
  medium: [
    'A brute-force O(n²) works, but the interviewer is looking for O(n) with a hash map.',
    'Use a dict to store `{value: index}` as you iterate.',
    'Check `target - num` in the dict before inserting the current num.',
  ],
  hard: [
    'An OrderedDict is the cleanest Python approach — it preserves insertion order.',
    'Move a key to the end on every get/put (most recently used).',
    'Evict `next(iter(cache))` (the least recently used) when capacity is exceeded.',
  ],
}
