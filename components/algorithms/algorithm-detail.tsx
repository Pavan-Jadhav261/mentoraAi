'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, RotateCcw, SlidersHorizontal, Code2, BookOpen } from 'lucide-react'
import StarRating from '@/components/star-rating'
import AskDoubt from '@/components/algorithms/ask-doubt'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import type { Algorithm } from '@/lib/dummy-data'
import { CHILD_EXPLANATIONS } from '@/lib/algorithm-lessons'

// ─────────────────────────────────────────────────────────────────────────────
// Theme tokens & styles
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  blue:   'var(--accent-blue)',
  green:  'var(--accent-green)',
  orange: 'var(--accent-orange)',
  yellow: 'var(--accent-yellow)',
  purple: 'var(--accent-purple)',
}

// ─────────────────────────────────────────────────────────────────────────────
// Base Data sets
// ─────────────────────────────────────────────────────────────────────────────
const SORT_INIT_VALS = [64, 34, 25, 12, 22, 11, 90]
const SEARCH_INIT_VALS = [3, 8, 14, 21, 29, 37, 44, 52, 61, 75]
const SEARCH_TARGET = 44

// Graph node locations
const GRAPH_POS: [number, number][] = [
  [60, 90],   // A (0)
  [170, 35],  // B (1)
  [170, 145], // C (2)
  [290, 35],  // D (3)
  [290, 145], // E (4)
  [400, 90]   // F (5)
]

const BIDIR_ADJ: Record<number, [number, number][]> = {
  0: [[1, 4], [2, 2]],
  1: [[0, 4], [3, 7], [4, 5]],
  2: [[0, 2], [4, 3]],
  3: [[1, 7], [5, 6]],
  4: [[1, 5], [2, 3], [5, 8]],
  5: [[3, 6], [4, 8]]
}

// Tree node locations (bst coordinates)
const TREE_NODES: [number, number, string][] = [
  [235, 28, '8'],   // 0
  [135, 85, '3'],   // 1
  [335, 85, '10'],  // 2
  [80, 145, '1'],   // 3
  [190, 145, '6'],  // 4
  [285, 145, '9'],  // 5
  [385, 145, '14'], // 6
  [220, 200, '7']   // 7 (used only in BST insert)
]

const TREE_EDGES = [
  [0, 1], // 8 -> 3
  [0, 2], // 8 -> 10
  [1, 3], // 3 -> 1
  [1, 4], // 3 -> 6
  [2, 5], // 10 -> 9
  [2, 6]  // 10 -> 14
]

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type SortState = {
  array: number[]
  active: number[]
  locked: number[]
  pivot?: number
  comparing?: number[]
  mergedRange?: [number, number] | null
  splitRanges?: [number, number][]
  caption: string
}

type SearchState = {
  array: number[]
  target: number
  lo?: number
  hi?: number
  mid?: number
  inspected: number[]
  found: boolean
  caption: string
}

type GraphState = {
  visited: number[]
  queue?: number[]
  stack?: number[]
  currentNode: number | null
  activeEdge?: [number, number]
  distances?: number[]
  caption: string
}

type TreeState = {
  visited: number[]
  activeNode: number | null
  caption: string
  insertedNode?: number // index of newly added node
}

type DPState = {
  memo?: Record<number, number>
  active: number[]
  cacheHit?: number
  r?: number
  c?: number
  dpTable?: number[][]
  comparingCells?: [number, number][]
  caption: string
}

type QueensState = {
  board: number[]
  activeCell?: [number, number]
  conflictCells?: [number, number][]
  caption: string
  found: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Generators
// ─────────────────────────────────────────────────────────────────────────────
function generateBubbleSort(arr: number[]): SortState[] {
  const frames: SortState[] = []
  const state = [...arr]
  const n = state.length
  const locked: number[] = []

  frames.push({
    array: [...state],
    active: [],
    locked: [],
    caption: 'Bubble Sort starting. Scan adjacent elements, swapping them if they are in the wrong order.'
  })

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      frames.push({
        array: [...state],
        active: [j, j + 1],
        locked: [...locked],
        caption: `Compare index ${j} (${state[j]}) and index ${j + 1} (${state[j + 1]}).`
      })

      if (state[j] > state[j + 1]) {
        const temp = state[j]
        state[j] = state[j + 1]
        state[j + 1] = temp
        frames.push({
          array: [...state],
          active: [j, j + 1],
          locked: [...locked],
          caption: `Since ${state[j + 1]} < ${state[j]}, we swap them.`
        })
      }
    }
    locked.push(n - 1 - i)
    frames.push({
      array: [...state],
      active: [],
      locked: [...locked],
      caption: `Element ${state[n - 1 - i]} is now in its final sorted position.`
    })
  }
  locked.push(0)
  frames.push({
    array: [...state],
    active: [],
    locked: [...locked],
    caption: '✓ Bubble sort complete! Every element has bubbled into place.'
  })
  return frames
}

function generateInsertionSort(arr: number[]): SortState[] {
  const frames: SortState[] = []
  const state = [...arr]
  const n = state.length

  frames.push({
    array: [...state],
    active: [0],
    locked: [0],
    caption: 'Insertion Sort starting. Build a sorted portion on the left side, inserting one element at a time.'
  })

  for (let i = 1; i < n; i++) {
    const key = state[i]
    let j = i - 1
    frames.push({
      array: [...state],
      active: [i],
      locked: Array.from({ length: i }, (_, k) => k),
      caption: `Pick next key ${key} at index ${i} to place in the sorted portion.`
    })

    while (j >= 0 && state[j] > key) {
      frames.push({
        array: [...state],
        active: [j + 1],
        comparing: [j],
        locked: Array.from({ length: i }, (_, k) => k),
        caption: `Compare ${key} with ${state[j]}. Since ${state[j]} > ${key}, shift ${state[j]} right.`
      })
      state[j + 1] = state[j]
      j--
    }
    state[j + 1] = key
    frames.push({
      array: [...state],
      active: [j + 1],
      locked: Array.from({ length: i + 1 }, (_, k) => k),
      caption: `Insert key ${key} at its correct sorted position (index ${j + 1}).`
    })
  }

  frames.push({
    array: [...state],
    active: [],
    locked: Array.from({ length: n }, (_, k) => k),
    caption: '✓ Insertion sort complete! Array is sorted.'
  })
  return frames
}

function generateQuickSort(arr: number[]): SortState[] {
  const frames: SortState[] = []
  const state = [...arr]
  const lockedSet = new Set<number>()

  function runQuickSort(l: number, r: number) {
    if (l >= r) {
      if (l === r) lockedSet.add(l)
      return
    }
    const pivotIdx = r
    const pivot = state[pivotIdx]
    frames.push({
      array: [...state],
      active: [l, r],
      locked: Array.from(lockedSet),
      pivot,
      caption: `Partition subarray [${l}...${r}] around pivot ${pivot} (at index ${r}).`
    })

    let i = l - 1
    for (let j = l; j < r; j++) {
      frames.push({
        array: [...state],
        active: [j],
        comparing: [pivotIdx],
        locked: Array.from(lockedSet),
        pivot,
        caption: `Compare index ${j} (${state[j]}) with pivot ${pivot}.`
      })

      if (state[j] <= pivot) {
        i++
        const temp = state[i]
        state[i] = state[j]
        state[j] = temp
        frames.push({
          array: [...state],
          active: [i, j],
          locked: Array.from(lockedSet),
          pivot,
          caption: `${state[i]} <= pivot (${pivot}). Swap index ${i} and index ${j}.`
        })
      }
    }
    const pivotDest = i + 1
    const temp = state[pivotDest]
    state[pivotDest] = state[r]
    state[r] = temp
    lockedSet.add(pivotDest)

    frames.push({
      array: [...state],
      active: [pivotDest],
      locked: Array.from(lockedSet),
      pivot,
      caption: `Place pivot ${pivot} at its final sorted position at index ${pivotDest}.`
    })

    runQuickSort(l, pivotDest - 1)
    runQuickSort(pivotDest + 1, r)
  }

  runQuickSort(0, state.length - 1)
  frames.push({
    array: [...state],
    active: [],
    locked: Array.from({ length: state.length }, (_, k) => k),
    caption: '✓ Quick sort complete! Every pivot is placed.'
  })
  return frames
}

function generateMergeSort(arr: number[]): SortState[] {
  const frames: SortState[] = []
  const state = [...arr]

  function merge(l: number, mid: number, r: number) {
    const leftPart = state.slice(l, mid + 1)
    const rightPart = state.slice(mid + 1, r + 1)
    let i = 0, j = 0, k = l

    frames.push({
      array: [...state],
      active: [],
      locked: [],
      mergedRange: [l, r],
      splitRanges: [],
      caption: `Prepare to merge sorted subarrays [${l}...${mid}] and [${mid + 1}...${r}].`
    })

    while (i < leftPart.length && j < rightPart.length) {
      frames.push({
        array: [...state],
        active: [l + i, mid + 1 + j],
        locked: [],
        mergedRange: [l, r],
        splitRanges: [],
        caption: `Compare left subarray head ${leftPart[i]} with right subarray head ${rightPart[j]}.`
      })

      if (leftPart[i] <= rightPart[j]) {
        state[k] = leftPart[i]
        frames.push({
          array: [...state],
          active: [k],
          locked: [],
          mergedRange: [l, r],
          splitRanges: [],
          caption: `Copy left element ${leftPart[i]} to position ${k}.`
        })
        i++
      } else {
        state[k] = rightPart[j]
        frames.push({
          array: [...state],
          active: [k],
          locked: [],
          mergedRange: [l, r],
          splitRanges: [],
          caption: `Copy right element ${rightPart[j]} to position ${k}.`
        })
        j++
      }
      k++
    }

    while (i < leftPart.length) {
      state[k] = leftPart[i]
      frames.push({
        array: [...state],
        active: [k],
        locked: [],
        mergedRange: [l, r],
        caption: `Copy remaining left element ${leftPart[i]} to position ${k}.`
      })
      i++
      k++
    }

    while (j < rightPart.length) {
      state[k] = rightPart[j]
      frames.push({
        array: [...state],
        active: [k],
        locked: [],
        mergedRange: [l, r],
        caption: `Copy remaining right element ${rightPart[j]} to position ${k}.`
      })
      j++
      k++
    }
  }

  function sort(l: number, r: number) {
    if (l >= r) return
    const mid = Math.floor((l + r) / 2)
    frames.push({
      array: [...state],
      active: [],
      locked: [],
      mergedRange: null,
      splitRanges: [[l, mid], [mid + 1, r]],
      caption: `Divide subarray [${l}...${r}] at midpoint ${mid}.`
    })
    sort(l, mid)
    sort(mid + 1, r)
    merge(l, mid, r)
  }

  sort(0, state.length - 1)
  frames.push({
    array: [...state],
    active: [],
    locked: Array.from({ length: state.length }, (_, k) => k),
    caption: '✓ Merge sort complete! Subarrays merged back fully.'
  })
  return frames
}

function generateHeapSort(arr: number[]): SortState[] {
  const frames: SortState[] = []
  const state = [...arr]
  const n = state.length

  frames.push({
    array: [...state],
    active: [],
    locked: [],
    caption: 'Heap Sort starting. Build a Max-Heap structure first, then repeatedly extract the largest element.'
  })

  function siftDown(size: number, idx: number) {
    let largest = idx
    const l = 2 * idx + 1
    const r = 2 * idx + 2

    if (l < size) {
      frames.push({
        array: [...state],
        active: [idx, l],
        locked: Array.from({ length: n - size }, (_, k) => n - 1 - k),
        caption: `Compare node ${state[idx]} with left child ${state[l]}.`
      })
      if (state[l] > state[largest]) largest = l
    }

    if (r < size) {
      frames.push({
        array: [...state],
        active: [largest, r],
        locked: Array.from({ length: n - size }, (_, k) => n - 1 - k),
        caption: `Compare current largest (${state[largest]}) with right child ${state[r]}.`
      })
      if (state[r] > state[largest]) largest = r
    }

    if (largest !== idx) {
      const temp = state[idx]
      state[idx] = state[largest]
      state[largest] = temp
      frames.push({
        array: [...state],
        active: [idx, largest],
        locked: Array.from({ length: n - size }, (_, k) => n - 1 - k),
        caption: `Swap ${temp} with larger child ${state[idx]}.`
      })
      siftDown(size, largest)
    }
  }

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(n, i)
  }

  frames.push({
    array: [...state],
    active: [],
    locked: [],
    caption: 'Max-Heap built successfully. The largest element is now at index 0.'
  })

  for (let i = n - 1; i > 0; i--) {
    const temp = state[0]
    state[0] = state[i]
    state[i] = temp
    frames.push({
      array: [...state],
      active: [0, i],
      locked: Array.from({ length: n - i }, (_, k) => n - 1 - k),
      caption: `Extract root ${temp} (largest) by swapping it with the last element of the heap.`
    })
    siftDown(i, 0)
  }

  frames.push({
    array: [...state],
    active: [],
    locked: Array.from({ length: n }, (_, k) => k),
    caption: '✓ Heap sort complete! Sorted array generated.'
  })
  return frames
}

function generateBinarySearch(arr: number[], target: number): SearchState[] {
  const frames: SearchState[] = []
  let lo = 0
  let hi = arr.length - 1

  frames.push({
    array: [...arr],
    target,
    lo,
    hi,
    inspected: [],
    found: false,
    caption: `Starting Binary Search. Target is ${target}. Set initial range: lo = 0, hi = ${hi}.`
  })

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    frames.push({
      array: [...arr],
      target,
      lo,
      hi,
      mid,
      inspected: [mid],
      found: false,
      caption: `Calculate middle index: mid = (${lo} + ${hi}) / 2 = ${mid}. Middle element is ${arr[mid]}.`
    })

    if (arr[mid] === target) {
      frames.push({
        array: [...arr],
        target,
        lo,
        hi,
        mid,
        inspected: [mid],
        found: true,
        caption: `✓ Target ${target} found at index ${mid}!`
      })
      break
    }

    if (arr[mid] < target) {
      lo = mid + 1
      frames.push({
        array: [...arr],
        target,
        lo,
        hi,
        mid,
        inspected: [mid],
        found: false,
        caption: `Since ${arr[mid]} < ${target}, discard the left half. Update lo to mid + 1 = ${lo}.`
      })
    } else {
      hi = mid - 1
      frames.push({
        array: [...arr],
        target,
        lo,
        hi,
        mid,
        inspected: [mid],
        found: false,
        caption: `Since ${arr[mid]} > ${target}, discard the right half. Update hi to mid - 1 = ${hi}.`
      })
    }
  }

  if (lo > hi) {
    frames.push({
      array: [...arr],
      target,
      inspected: [],
      found: false,
      caption: `Target ${target} was not found in the array.`
    })
  }
  return frames
}

function generateLinearSearch(arr: number[], target: number): SearchState[] {
  const frames: SearchState[] = []
  const inspected: number[] = []

  frames.push({
    array: [...arr],
    target,
    inspected: [],
    found: false,
    caption: `Starting Linear Search. Scan each index one by one looking for target ${target}.`
  })

  for (let i = 0; i < arr.length; i++) {
    inspected.push(i)
    frames.push({
      array: [...arr],
      target,
      inspected: [...inspected],
      found: false,
      caption: `Checking element at index ${i} (value: ${arr[i]}).`
    })

    if (arr[i] === target) {
      frames.push({
        array: [...arr],
        target,
        inspected: [...inspected],
        found: true,
        caption: `✓ Found target ${target} at index ${i}!`
      })
      return frames
    }
  }

  frames.push({
    array: [...arr],
    target,
    inspected: [...inspected],
    found: false,
    caption: `Finished scan. Target ${target} not found.`
  })
  return frames
}

function generateBFS(): GraphState[] {
  const frames: GraphState[] = []
  const visited: number[] = []
  const queue: number[] = [0]
  const seen = new Set<number>([0])

  frames.push({
    visited: [],
    queue: [...queue],
    currentNode: null,
    caption: 'Breadth-First Search starts at A. Neighbors are added to a Queue (FIFO).'
  })

  while (queue.length > 0) {
    const curr = queue.shift()!
    visited.push(curr)

    frames.push({
      visited: [...visited],
      queue: [...queue],
      currentNode: curr,
      caption: `Dequeue node ${String.fromCharCode(65 + curr)}. Inspect its unvisited neighbors.`
    })

    const neighbors = BIDIR_ADJ[curr] || []
    for (const [neigh] of neighbors) {
      if (!seen.has(neigh)) {
        seen.add(neigh)
        queue.push(neigh)
        frames.push({
          visited: [...visited],
          queue: [...queue],
          currentNode: curr,
          activeEdge: [curr, neigh],
          caption: `Enqueue unvisited neighbor ${String.fromCharCode(65 + neigh)}.`
        })
      }
    }
  }

  frames.push({
    visited: [...visited],
    queue: [],
    currentNode: null,
    caption: '✓ BFS complete! Nodes visited level-by-level.'
  })
  return frames
}

function generateDFS(): GraphState[] {
  const frames: GraphState[] = []
  const visited: number[] = []
  const stack: number[] = []
  const seen = new Set<number>()

  function dfsVisit(node: number, parent: number | null) {
    seen.add(node)
    stack.push(node)
    visited.push(node)

    frames.push({
      visited: [...visited],
      stack: [...stack],
      currentNode: node,
      activeEdge: parent !== null ? [parent, node] : undefined,
      caption: `Explore node ${String.fromCharCode(65 + node)}. Push it to recursion stack and mark visited.`
    })

    const neighbors = BIDIR_ADJ[node] || []
    for (const [neigh] of neighbors) {
      if (!seen.has(neigh)) {
        dfsVisit(neigh, node)
      }
    }

    stack.pop()
    frames.push({
      visited: [...visited],
      stack: [...stack],
      currentNode: node,
      caption: `No more unvisited neighbors. Pop ${String.fromCharCode(65 + node)} from recursion stack.`
    })
  }

  dfsVisit(0, null)
  frames.push({
    visited: [...visited],
    stack: [],
    currentNode: null,
    caption: '✓ DFS complete! Reached end of all paths.'
  })
  return frames
}

function generateDijkstra(): GraphState[] {
  const frames: GraphState[] = []
  const dist = Array(6).fill(Infinity)
  dist[0] = 0
  const settled = new Set<number>()

  frames.push({
    visited: [],
    currentNode: null,
    distances: [...dist],
    caption: "Initialize Dijkstra's: Set dist[Start] = 0, and all other node distances to Infinity (∞)."
  })

  while (settled.size < 6) {
    let u = -1
    let minD = Infinity
    for (let i = 0; i < 6; i++) {
      if (!settled.has(i) && dist[i] < minD) {
        minD = dist[i]
        u = i
      }
    }

    if (u === -1) break
    settled.add(u)

    frames.push({
      visited: Array.from(settled),
      currentNode: u,
      distances: [...dist],
      caption: `Choose unsettled node ${String.fromCharCode(65 + u)} with minimum tentative distance (${dist[u]}).`
    })

    const neighbors = BIDIR_ADJ[u] || []
    for (const [v, weight] of neighbors) {
      if (!settled.has(v)) {
        const alt = dist[u] + weight
        frames.push({
          visited: Array.from(settled),
          currentNode: u,
          activeEdge: [u, v],
          distances: [...dist],
          caption: `Relax edge ${String.fromCharCode(65 + u)} → ${String.fromCharCode(65 + v)}. Cost: ${dist[u]} + ${weight} = ${alt}.`
        })

        if (alt < dist[v]) {
          const oldVal = dist[v]
          dist[v] = alt
          frames.push({
            visited: Array.from(settled),
            currentNode: u,
            activeEdge: [u, v],
            distances: [...dist],
            caption: `Path cost ${alt} < old distance ${oldVal === Infinity ? '∞' : oldVal}. Update distance!`
          })
        }
      }
    }
  }

  frames.push({
    visited: Array.from(settled),
    currentNode: null,
    distances: [...dist],
    caption: "✓ Dijkstra complete! Shortest path to all reachable nodes finalized."
  })
  return frames
}

function generateTreeTraversals(): TreeState[] {
  const frames: TreeState[] = []
  const visited: number[] = []

  function traverse(nodeIdx: number | null) {
    if (nodeIdx === null) return

    frames.push({
      visited: [...visited],
      activeNode: nodeIdx,
      caption: `Entering subtree at Node ${TREE_NODES[nodeIdx][2]}. Go left first.`
    })

    const left = nodeIdx === 0 ? 1 : nodeIdx === 1 ? 3 : nodeIdx === 2 ? 5 : null
    traverse(left)

    visited.push(nodeIdx)
    frames.push({
      visited: [...visited],
      activeNode: nodeIdx,
      caption: `Add Node ${TREE_NODES[nodeIdx][2]} to in-order path. Now explore its right child.`
    })

    const right = nodeIdx === 0 ? 2 : nodeIdx === 1 ? 4 : nodeIdx === 2 ? 6 : null
    traverse(right)
  }

  traverse(0)
  frames.push({
    visited: [...visited],
    activeNode: null,
    caption: '✓ In-order traversal complete: 1 → 3 → 6 → 8 → 9 → 10 → 14.'
  })
  return frames
}

function generateBSTInsert(): TreeState[] {
  const frames: TreeState[] = []
  const ins = 7

  frames.push({
    visited: [],
    activeNode: 0,
    caption: `To insert ${ins}, compare with root node 8. Since ${ins} < 8, traverse left.`
  })

  frames.push({
    visited: [0],
    activeNode: 1,
    caption: `Compare ${ins} with node 3. Since ${ins} > 3, traverse right.`
  })

  frames.push({
    visited: [0, 1],
    activeNode: 4,
    caption: `Compare ${ins} with node 6. Since ${ins} > 6, traverse right.`
  })

  frames.push({
    visited: [0, 1, 4],
    activeNode: 7,
    insertedNode: 7,
    caption: `Right child of node 6 is empty. Plant new leaf node ${ins} here.`
  })

  frames.push({
    visited: [0, 1, 4, 7],
    activeNode: null,
    caption: '✓ Node 7 successfully inserted. Binary Search Tree properties preserved.'
  })
  return frames
}

function generateFibonacciMemo(): DPState[] {
  const frames: DPState[] = []
  const memo: Record<number, number> = {}

  function fib(n: number): number {
    frames.push({
      memo: { ...memo },
      active: [n],
      caption: `Call F(${n}). Check if it is in our memoization cache.`
    })

    if (n in memo) {
      frames.push({
        memo: { ...memo },
        active: [n],
        cacheHit: n,
        caption: `Cache hit! F(${n}) = ${memo[n]} is already solved. Return it directly.`
      })
      return memo[n]
    }

    if (n < 2) {
      frames.push({
        memo: { ...memo },
        active: [n],
        caption: `Base case reached. F(${n}) = ${n}.`
      })
      memo[n] = n
      return n
    }

    const a = fib(n - 1)
    const b = fib(n - 2)
    const result = a + b
    memo[n] = result

    frames.push({
      memo: { ...memo },
      active: [n],
      caption: `Compute F(${n}) = F(${n - 1}) + F(${n - 2}) = ${a} + ${b} = ${result}. Store it in cache.`
    })
    return result
  }

  fib(5)
  frames.push({
    memo: { ...memo },
    active: [],
    caption: '✓ Memoization complete! Redundant calls eliminated.'
  })
  return frames
}

function generateKnapsack(): DPState[] {
  const frames: DPState[] = []
  const ITEMS = [
    { name: 'Gem', weight: 1, value: 6 },
    { name: 'Ring', weight: 2, value: 10 },
    { name: 'Crown', weight: 3, value: 12 }
  ]
  const CAPACITY = 5
  const rows = ITEMS.length + 1
  const cols = CAPACITY + 1
  const dp = Array.from({ length: rows }, () => Array(cols).fill(0))

  frames.push({
    r: 0,
    c: 0,
    dpTable: dp.map(row => [...row]),
    active: [],
    caption: 'Initialize DP table. Row ∅ is 0 value, Column 0 is capacity 0.'
  })

  for (let r = 1; r < rows; r++) {
    const { name, weight, value } = ITEMS[r - 1]
    for (let c = 0; c < cols; c++) {
      if (c < weight) {
        dp[r][c] = dp[r - 1][c]
        frames.push({
          r,
          c,
          dpTable: dp.map(row => [...row]),
          active: [],
          comparingCells: [[r - 1, c]],
          caption: `Item ${name} (weight ${weight}) is too heavy for current capacity ${c}. Copy value from row above (${dp[r-1][c]}).`
        })
      } else {
        const excl = dp[r - 1][c]
        const incl = dp[r - 1][c - weight] + value
        dp[r][c] = Math.max(excl, incl)
        frames.push({
          r,
          c,
          dpTable: dp.map(row => [...row]),
          active: [],
          comparingCells: [[r - 1, c], [r - 1, c - weight]],
          caption: `For ${name} (w=${weight}, v=${value}): Compare excluding (${excl}) vs including item (${incl}). Max is ${dp[r][c]}.`
        })
      }
    }
  }

  frames.push({
    r: rows - 1,
    c: CAPACITY,
    dpTable: dp.map(row => [...row]),
    active: [],
    caption: `✓ DP grid full. Max value of ${dp[rows - 1][CAPACITY]} obtained at bottom-right cell.`
  })
  return frames
}

function generateNQueens(): QueensState[] {
  const frames: QueensState[] = []
  const board: number[] = []

  function getConflicts(row: number, col: number): [number, number][] {
    const conflicts: [number, number][] = []
    for (let r = 0; r < row; r++) {
      const c = board[r]
      if (c === col || Math.abs(r - row) === Math.abs(c - col)) {
        conflicts.push([r, c])
      }
    }
    return conflicts
  }

  function solve(row: number): boolean {
    if (row === 4) {
      frames.push({
        board: [...board],
        caption: '✓ Found complete conflict-free placement configuration!',
        found: true
      })
      return true
    }

    for (let col = 0; col < 4; col++) {
      frames.push({
        board: [...board],
        activeCell: [row, col],
        caption: `Checking placement at Row ${row + 1}, Col ${col + 1}.`,
        found: false
      })

      const conflicts = getConflicts(row, col)
      if (conflicts.length === 0) {
        board.push(col)
        frames.push({
          board: [...board],
          activeCell: [row, col],
          caption: `Position safe. Place Queen at Row ${row + 1}, Col ${col + 1}.`,
          found: false
        })

        if (solve(row + 1)) return true

        board.pop()
        frames.push({
          board: [...board],
          activeCell: [row, col],
          caption: `Branch failed. Backtrack and remove Queen from Row ${row + 1}, Col ${col + 1}.`,
          found: false
        })
      } else {
        frames.push({
          board: [...board],
          activeCell: [row, col],
          conflictCells: conflicts,
          caption: `Conflict detected with Queen at Row ${conflicts[0][0] + 1}, Col ${conflicts[0][1] + 1}.` ,
          found: false
        })
      }
    }
    return false
  }

  solve(0)
  return frames
}

// ─────────────────────────────────────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────────────────────────────────────
function SortVisual({ state }: { state: SortState }) {
  const maxVal = Math.max(...state.array)
  const mergedStart = state.mergedRange?.[0] ?? -1
  const mergedEnd = state.mergedRange?.[1] ?? -1

  return (
    <div className="w-full">
      <div
        className="mx-auto flex max-w-lg items-end justify-center gap-2 rounded-2xl border border-[var(--border)] px-4 pb-3 pt-8"
        style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--accent-blue) 4%, transparent), transparent)' }}
      >
        {state.array.map((value, index) => {
          const isActive = state.active.includes(index)
          const isComparing = state.comparing?.includes(index)
          const isPivot = state.pivot === value
          const isLocked = state.locked.includes(index)
          const isInMergedRange = index >= mergedStart && index <= mergedEnd

          let barBg = `linear-gradient(180deg, ${C.blue}, color-mix(in srgb, var(--accent-blue) 40%, transparent))`
          let borderClr = 'var(--border)'
          let shadow = 'none'

          if (isPivot) {
            barBg = `linear-gradient(180deg, ${C.yellow}, color-mix(in srgb, var(--accent-yellow) 40%, transparent))`
            borderClr = C.yellow
            shadow = `0 0 16px ${C.yellow}`
          } else if (isActive) {
            barBg = `linear-gradient(180deg, ${C.orange}, color-mix(in srgb, var(--accent-orange) 50%, transparent))`
            borderClr = C.orange
            shadow = `0 0 16px ${C.orange}`
          } else if (isComparing) {
            barBg = `linear-gradient(180deg, ${C.purple}, color-mix(in srgb, var(--accent-purple) 40%, transparent))`
            borderClr = C.purple
            shadow = `0 0 12px ${C.purple}`
          } else if (isLocked) {
            barBg = `linear-gradient(180deg, ${C.green}, color-mix(in srgb, var(--accent-green) 50%, transparent))`
            borderClr = C.green
            shadow = `0 0 12px ${C.green}`
          } else if (state.mergedRange && !isInMergedRange) {
            // Dim elements not in active merge range
            barBg = `linear-gradient(180deg, var(--border), transparent)`
            borderClr = 'transparent'
          }

          const heightPct = 35 + (value / maxVal) * 140

          return (
            <motion.div
              key={index}
              layout
              className="relative flex flex-1 flex-col items-center gap-1.5"
              transition={{ type: 'spring', stiffness: 350, damping: 24, mass: 0.8 }}
            >
              {isPivot && (
                <span className="absolute -top-7 rounded-full bg-[var(--accent-yellow)] px-2 py-0.5 text-[0.6rem] font-bold text-black" style={{ boxShadow: `0 0 8px ${C.yellow}` }}>
                  PIVOT
                </span>
              )}
              {isActive && !isPivot && (
                <span className="absolute -top-7 rounded-full bg-[var(--accent-orange)] px-2 py-0.5 text-[0.6rem] font-bold text-white" style={{ boxShadow: `0 0 8px ${C.orange}` }}>
                  ACTIVE
                </span>
              )}
              <motion.div
                className="w-full max-w-12 rounded-t-xl border font-mono text-xs font-bold text-white flex items-start justify-center pt-1"
                animate={{
                  height: `${heightPct}px`,
                  background: barBg,
                  borderColor: borderClr,
                  boxShadow: shadow,
                  scale: isActive || isPivot ? 1.08 : 1
                }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              >
                {value}
              </motion.div>
              <span className="text-[0.6rem] font-bold text-[var(--muted-foreground)]">
                {isLocked ? '✓' : index + 1}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function SearchVisual({ state }: { state: SearchState }) {
  return (
    <div className="w-full">
      <div className="mb-5 flex justify-center gap-3 text-sm">
        <span className="text-[var(--muted-foreground)]">Target</span>
        <span
          className="rounded-full px-3 py-0.5 font-mono font-bold text-white text-sm"
          style={{ background: C.green, boxShadow: `0 0 12px ${C.green}` }}
        >
          {state.target}
        </span>
      </div>

      <div className="relative flex flex-wrap justify-center gap-2 px-2">
        {state.array.map((n, i) => {
          const isInspected = state.inspected.includes(i)
          const isMid = state.mid === i
          const isFound = state.found && n === state.target
          const isEliminated = (state.lo !== undefined && state.hi !== undefined) && (i < state.lo || i > state.hi)

          let borderClr = 'var(--border)'
          let bg = 'var(--background)'
          let textClr = 'var(--foreground)'
          let shadow = 'none'
          let scale = 1

          if (isFound) {
            borderClr = C.green
            bg = `color-mix(in srgb, var(--accent-green) 18%, transparent)`
            textClr = C.green
            shadow = `0 0 20px ${C.green}`
            scale = 1.15
          } else if (isMid) {
            borderClr = C.orange
            bg = `color-mix(in srgb, var(--accent-orange) 16%, transparent)`
            textClr = C.orange
            shadow = `0 0 14px ${C.orange}`
            scale = 1.1
          } else if (isInspected) {
            borderClr = C.blue
            bg = `color-mix(in srgb, var(--accent-blue) 12%, transparent)`
            textClr = C.blue
          } else if (isEliminated) {
            bg = 'transparent'
            textClr = 'var(--muted-foreground)'
            scale = 0.9
          }

          return (
            <div key={n} className="relative">
              {isMid && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs"
                  style={{ color: C.orange }}
                >
                  ▼
                </motion.div>
              )}
              <motion.div
                animate={{
                  borderColor: borderClr,
                  background: bg,
                  color: textClr,
                  boxShadow: shadow,
                  scale,
                  opacity: isEliminated ? 0.35 : 1
                }}
                className="grid h-12 w-12 place-items-center rounded-xl border font-mono text-sm font-bold"
              >
                {n}
              </motion.div>
              <div className="mt-1 text-center text-[0.6rem] text-[var(--muted-foreground)]">{i}</div>
            </div>
          )
        })}
      </div>

      {(state.lo !== undefined && state.hi !== undefined) && (
        <div className="mt-5 flex justify-center gap-6 text-xs text-[var(--muted-foreground)] font-mono">
          <span>lo={state.lo}</span>
          {state.mid !== undefined && <span className="text-[var(--accent-orange)]">mid={state.mid}</span>}
          <span>hi={state.hi}</span>
        </div>
      )}
    </div>
  )
}

function GraphVisual({ state }: { state: GraphState }) {
  const isBfs = state.queue !== undefined
  const containerList = isBfs ? state.queue : state.stack

  return (
    <div className="w-full max-w-lg mx-auto">
      <svg viewBox="0 0 470 185" className="w-full">
        {/* Draw Edges */}
        {Object.entries(BIDIR_ADJ).map(([uStr, neighbors]) => {
          const u = parseInt(uStr)
          return neighbors.map(([v, weight]) => {
            if (u > v) return null // Draw edge once bidirectional
            const isTraversed = state.visited.includes(u) && state.visited.includes(v)
            const isActive = state.activeEdge && ((state.activeEdge[0] === u && state.activeEdge[1] === v) || (state.activeEdge[0] === v && state.activeEdge[1] === u))
            const edgeClr = isActive ? C.orange : isTraversed ? C.blue : 'var(--border)'

            return (
              <g key={`${u}-${v}`}>
                <motion.line
                  x1={GRAPH_POS[u][0]}
                  y1={GRAPH_POS[u][1]}
                  x2={GRAPH_POS[v][0]}
                  y2={GRAPH_POS[v][1]}
                  animate={{
                    stroke: edgeClr,
                    strokeWidth: isActive ? 4 : isTraversed ? 3 : 2,
                    opacity: isTraversed || isActive ? 1 : 0.4,
                    filter: isActive ? `drop-shadow(0 0 6px ${C.orange})` : isTraversed ? `drop-shadow(0 0 4px ${C.blue})` : 'none'
                  }}
                  transition={{ duration: 0.3 }}
                />
                {state.distances && (
                  <text
                    x={(GRAPH_POS[u][0] + GRAPH_POS[v][0]) / 2}
                    y={(GRAPH_POS[u][1] + GRAPH_POS[v][1]) / 2 - 4}
                    textAnchor="middle"
                    fontSize="9"
                    fill="var(--muted-foreground)"
                    fontWeight="bold"
                  >
                    {weight}
                  </text>
                )}
              </g>
            )
          })
        })}

        {/* Draw Nodes */}
        {GRAPH_POS.map(([x, y], i) => {
          const isVisited = state.visited.includes(i)
          const isCurrent = state.currentNode === i
          const label = String.fromCharCode(65 + i)

          return (
            <g key={i}>
              {isCurrent && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r={27}
                  fill="none"
                  stroke={C.orange}
                  strokeWidth={2}
                  animate={{ opacity: [0.7, 0.2, 0.7], r: [23, 29, 23] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              <motion.circle
                cx={x}
                cy={y}
                r={18}
                animate={{
                  fill: isCurrent ? C.orange : isVisited ? C.blue : 'var(--background)',
                  stroke: isVisited ? 'none' : 'var(--border)',
                  filter: isCurrent ? `drop-shadow(0 0 10px ${C.orange})` : isVisited ? `drop-shadow(0 0 5px ${C.blue})` : 'none'
                }}
                strokeWidth={2}
                transition={{ duration: 0.3 }}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill={isVisited || isCurrent ? 'white' : 'var(--foreground)'}
              >
                {label}
              </text>

              {state.distances && state.distances[i] !== Infinity && (
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={x}
                  y={y - 24}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={C.green}
                >
                  d={state.distances[i]}
                </motion.text>
              )}
            </g>
          )
        })}
      </svg>

      {containerList && (
        <div className="mt-4 flex justify-center gap-2 text-xs text-[var(--muted-foreground)]">
          <span className="font-semibold">{isBfs ? 'Queue (FIFO)' : 'Stack (LIFO)'}:</span>
          <span className="font-mono">
            [ {containerList.map(n => String.fromCharCode(65 + n)).join(', ')} ]
          </span>
        </div>
      )}
    </div>
  )
}

function TreeVisual({ state }: { state: TreeState }) {
  const isInsert = state.insertedNode !== undefined

  return (
    <div className="w-full max-w-lg mx-auto">
      <svg viewBox="0 0 470 230" className="w-full">
        {/* Draw Edges */}
        {TREE_EDGES.map(([a, b]) => {
          const isPath = state.visited.includes(b)
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={TREE_NODES[a][0]}
              y1={TREE_NODES[a][1]}
              x2={TREE_NODES[b][0]}
              y2={TREE_NODES[b][1]}
              animate={{
                stroke: isPath ? C.blue : 'var(--border)',
                strokeWidth: isPath ? 3 : 2,
                opacity: isPath ? 1 : 0.4
              }}
              transition={{ duration: 0.3 }}
            />
          )
        })}

        {isInsert && state.visited.includes(4) && (
          <motion.line
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            x1={TREE_NODES[4][0]}
            y1={TREE_NODES[4][1]}
            x2={TREE_NODES[7][0]}
            y2={TREE_NODES[7][1]}
            stroke={C.green}
            strokeWidth={3}
          />
        )}

        {/* Draw Nodes */}
        {TREE_NODES.map(([x, y, label], i) => {
          if (i === 7 && !isInsert) return null // node 7 is insert only
          const isVisited = state.visited.includes(i)
          const isCurrent = state.activeNode === i
          const isNewNode = i === 7

          return (
            <g key={i}>
              {isCurrent && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r={26}
                  fill="none"
                  stroke={C.orange}
                  strokeWidth={2}
                  animate={{ opacity: [0.7, 0.2, 0.7], r: [22, 28, 22] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              <motion.circle
                cx={x}
                cy={y}
                r={18}
                animate={{
                  fill: isNewNode ? C.green : isCurrent ? C.orange : isVisited ? C.blue : 'var(--background)',
                  stroke: isVisited || isNewNode ? 'none' : 'var(--border)',
                  filter: isCurrent ? `drop-shadow(0 0 10px ${C.orange})` : isVisited ? `drop-shadow(0 0 5px ${C.blue})` : isNewNode ? `drop-shadow(0 0 10px ${C.green})` : 'none'
                }}
                strokeWidth={2}
                transition={{ duration: 0.3 }}
              />
              <text
                x={x}
                y={y + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill={isVisited || isCurrent || isNewNode ? 'white' : 'var(--foreground)'}
              >
                {label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function DPVisual({ state }: { state: DPState }) {
  const isFib = state.memo !== undefined

  if (isFib) {
    const memo = state.memo || {}
    return (
      <div className="w-full">
        <div className="mb-4 text-center text-xs text-[var(--muted-foreground)]">
          Memoization Cache Array
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 8 }).map((_, i) => {
            const hasVal = i in memo
            const isActive = state.active.includes(i)
            const isHit = state.cacheHit === i

            let borderClr = 'var(--border)'
            let bg = 'var(--background)'
            let shadow = 'none'

            if (isActive) {
              borderClr = C.orange
              bg = `color-mix(in srgb, var(--accent-orange) 16%, transparent)`
              shadow = `0 0 12px ${C.orange}`
            } else if (isHit) {
              borderClr = C.purple
              bg = `color-mix(in srgb, var(--accent-purple) 18%, transparent)`
              shadow = `0 0 16px ${C.purple}`
            } else if (hasVal) {
              borderClr = C.green
              bg = `color-mix(in srgb, var(--accent-green) 12%, transparent)`
            }

            return (
              <motion.div
                key={i}
                animate={{ borderColor: borderClr, background: bg, boxShadow: shadow }}
                className="relative flex flex-col items-center rounded-xl border px-4 py-2 font-mono text-sm min-w-[64px]"
              >
                <span className="text-[0.65rem] text-[var(--muted-foreground)] mb-1">F({i})</span>
                <AnimatePresence mode="wait">
                  {hasVal ? (
                    <motion.b
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{ color: isHit ? C.purple : C.green }}
                    >
                      {memo[i]}
                    </motion.b>
                  ) : (
                    <span className="text-[var(--muted-foreground)] font-bold">?</span>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // Knapsack 2D DP Table Visual
  const ITEMS = [
    { name: 'Gem', weight: 1 },
    { name: 'Ring', weight: 2 },
    { name: 'Crown', weight: 3 }
  ]
  const rows = 4
  const cols = 6
  const grid = state.dpTable || Array.from({ length: rows }, () => Array(cols).fill(0))

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `40px repeat(${cols}, 1fr)` }}>
        {/* Table headers */}
        <div className="text-[0.6rem] text-[var(--muted-foreground)] font-bold flex items-center justify-center">Item\Cap</div>
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="text-[0.65rem] font-bold text-center font-mono text-[var(--muted-foreground)]">{c}</div>
        ))}

        {Array.from({ length: rows }).map((_, r) => {
          const itemLabel = r === 0 ? '∅' : ITEMS[r - 1].name
          return (
            <React.Fragment key={r}>
              <div className="text-[0.65rem] font-mono font-bold text-[var(--muted-foreground)] flex items-center justify-start pl-1">
                {itemLabel}
              </div>
              {Array.from({ length: cols }).map((_, c) => {
                const isCurrent = state.r === r && state.c === c
                const isComparing = state.comparingCells?.some(([cr, cc]) => cr === r && cc === c)

                let borderClr = 'var(--border)'
                let bg = 'var(--background)'
                let text = 'var(--foreground)'
                let shadow = 'none'

                if (isCurrent) {
                  borderClr = C.orange
                  bg = `color-mix(in srgb, var(--accent-orange) 22%, transparent)`
                  text = C.orange
                  shadow = `0 0 12px ${C.orange}`
                } else if (isComparing) {
                  borderClr = C.blue
                  bg = `color-mix(in srgb, var(--accent-blue) 14%, transparent)`
                  text = C.blue
                } else if (r < (state.r ?? 0) || (r === state.r && c < (state.c ?? 0))) {
                  bg = `color-mix(in srgb, var(--accent-green) 8%, transparent)`
                }

                return (
                  <motion.div
                    key={c}
                    animate={{ borderColor: borderClr, background: bg, color: text, boxShadow: shadow }}
                    className="grid aspect-square place-items-center rounded-lg border text-xs font-mono font-bold"
                  >
                    {grid[r][c]}
                  </motion.div>
                )
              })}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

import React from 'react'

function QueensVisual({ state }: { state: QueensState }) {
  const isAttack = (row: number, col: number) => {
    return state.conflictCells?.some(([r, c]) => r === row && c === col)
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="grid overflow-hidden rounded-2xl border border-[var(--border)]"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          width: 220,
          boxShadow: '0 0 30px color-mix(in srgb, var(--accent-purple) 15%, transparent)'
        }}
      >
        {Array.from({ length: 16 }).map((_, i) => {
          const row = Math.floor(i / 4)
          const col = i % 4
          const hasQueen = state.board[row] === col
          const isCheck = state.activeCell?.[0] === row && state.activeCell?.[1] === col
          const conflict = isAttack(row, col)
          const isLight = (row + col) % 2 === 0

          let bg = isLight ? '#f5f0e8' : '#c8b890'
          let content = null

          if (hasQueen) {
            bg = `color-mix(in srgb, var(--accent-blue) 25%, ${bg})`
            content = (
              <motion.span
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-2xl"
                style={{ color: C.blue, filter: `drop-shadow(0 0 5px ${C.blue})` }}
              >
                ♛
              </motion.span>
            )
          } else if (isCheck) {
            bg = conflict
              ? `color-mix(in srgb, var(--accent-orange) 30%, ${bg})`
              : `color-mix(in srgb, var(--accent-yellow) 25%, ${bg})`
            content = (
              <span className="text-xl font-bold" style={{ color: conflict ? C.orange : C.yellow }}>
                ?
              </span>
            )
          } else if (conflict) {
            bg = `color-mix(in srgb, var(--accent-orange) 15%, ${bg})`
            content = <span className="text-xs font-bold" style={{ color: C.orange }}>×</span>
          }

          return (
            <div
              key={i}
              className="aspect-square flex items-center justify-center"
              style={{ width: 55, height: 55, background: bg }}
            >
              {content}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex gap-4 text-[0.65rem] text-[var(--muted-foreground)]">
        <span className="flex items-center gap-1.5"><span className="text-sm" style={{ color: C.blue }}>♛</span> Safe Queen</span>
        <span className="flex items-center gap-1.5"><span className="text-sm font-bold" style={{ color: C.yellow }}>?</span> Checking</span>
        <span className="flex items-center gap-1.5"><span className="text-sm font-bold" style={{ color: C.orange }}>×</span> Attack vector</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Combined visual container
// ─────────────────────────────────────────────────────────────────────────────
function AlgorithmVisual({ slug, frame }: { slug: string; frame: any }) {
  if (!frame) return null

  const sortSlugs = ['quick-sort', 'merge-sort', 'heap-sort', 'insertion-sort', 'bubble-sort']
  const searchSlugs = ['binary-search', 'linear-search']
  const graphSlugs = ['bfs', 'dfs', 'dijkstra']
  const treeSlugs = ['tree-traversals', 'bst-insert-delete']
  const dpSlugs = ['fibonacci-memo', 'knapsack']

  if (sortSlugs.includes(slug)) return <SortVisual state={frame} />
  if (searchSlugs.includes(slug)) return <SearchVisual state={frame} />
  if (graphSlugs.includes(slug)) return <GraphVisual state={frame} />
  if (treeSlugs.includes(slug)) return <TreeVisual state={frame} />
  if (dpSlugs.includes(slug)) return <DPVisual state={frame} />
  return <QueensVisual state={frame} />
}

// ─────────────────────────────────────────────────────────────────────────────
// Page Export
// ─────────────────────────────────────────────────────────────────────────────
type Tab = 'code' | 'explanation'
const EXPLANATIONS: Record<string, string> = CHILD_EXPLANATIONS
const DEFAULT_EXPLANATION = 'Trace the execution step-by-step and inspect memory/structure mutations.'

export default function AlgorithmDetail({ algo, code }: { algo: Algorithm; code: { js?: string; python?: string } }) {
  const [tab, setTab] = useState<Tab>('code')
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [step, setStep] = useState(0)

  // Compute total frames dynamically based on the algorithm
  const frames = useMemo(() => {
    const slug = algo.slug
    if (slug === 'bubble-sort') return generateBubbleSort(SORT_INIT_VALS)
    if (slug === 'insertion-sort') return generateInsertionSort(SORT_INIT_VALS)
    if (slug === 'quick-sort') return generateQuickSort(SORT_INIT_VALS)
    if (slug === 'merge-sort') return generateMergeSort(SORT_INIT_VALS)
    if (slug === 'heap-sort') return generateHeapSort(SORT_INIT_VALS)
    if (slug === 'binary-search') return generateBinarySearch(SEARCH_INIT_VALS, SEARCH_TARGET)
    if (slug === 'linear-search') return generateLinearSearch(SEARCH_INIT_VALS, SEARCH_TARGET)
    if (slug === 'bfs') return generateBFS()
    if (slug === 'dfs') return generateDFS()
    if (slug === 'dijkstra') return generateDijkstra()
    if (slug === 'tree-traversals') return generateTreeTraversals()
    if (slug === 'bst-insert-delete') return generateBSTInsert()
    if (slug === 'fibonacci-memo') return generateFibonacciMemo()
    if (slug === 'knapsack') return generateKnapsack()
    return generateNQueens() // n-queens
  }, [algo.slug])

  const maxSteps = frames.length - 1

  // Handle auto-playback timing loop
  useEffect(() => {
    if (!playing) return
    const intervalTime = Math.max(250, 1000 / speed)
    const id = window.setInterval(() => {
      setStep(s => {
        if (s >= maxSteps) {
          setPlaying(false)
          return s
        }
        return s + 1
      })
    }, intervalTime)
    return () => window.clearInterval(id)
  }, [playing, speed, maxSteps])

  // Reset steps if algorithm changes
  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [algo.slug])

  const currentFrame = frames[step] ?? frames[0]

  const lang = code.python ? 'python' : 'javascript'
  const src = code.python ?? code.js ?? `// Reference implementation for ${algo.name} goes here.`

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[var(--accent-blue)]/30 bg-[var(--accent-blue)]/8 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--accent-blue)]">
            {algo.category}
          </span>
          <StarRating stars={algo.stars} />
        </div>
        <h1 className="mb-3 font-display text-4xl font-bold text-[var(--foreground)]">{algo.name}</h1>
        <p className="max-w-[52ch] leading-relaxed text-[var(--muted-foreground)]">{algo.desc}</p>
        <div className="mt-4 flex gap-3">
          <span className="rounded-full border border-[var(--accent-green)]/20 bg-[var(--accent-green)]/10 px-3 py-1.5 font-mono text-xs text-[var(--accent-green)]">
            Time: {algo.time}
          </span>
          <span className="rounded-full border border-[var(--accent-orange)]/20 bg-[var(--accent-orange)]/10 px-3 py-1.5 font-mono text-xs text-[var(--accent-orange)]">
            Space: {algo.space}
          </span>
        </div>
      </div>

      {/* Main visual box */}
      <div className="relative flex min-h-[26rem] flex-col items-center justify-center overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10">
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_80%_at_50%_0%,color-mix(in_srgb,var(--accent-blue)_8%,transparent),transparent_70%)]" />
        <span className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--accent-purple)_4%,transparent),transparent)]" />

        <div className="relative w-full py-4">
          <AlgorithmVisual slug={algo.slug} frame={currentFrame} />
        </div>

        {/* Real-time caption explanation block */}
        <div className="w-full max-w-lg mt-6 px-4 py-3 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-md border border-[var(--border)] text-center min-h-[4rem] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-medium leading-relaxed text-[var(--foreground)]"
            >
              {currentFrame?.caption || 'Ready.'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Dynamic step visual track */}
      <div className="flex w-full gap-1 overflow-hidden px-1 h-1.5 bg-[var(--border)] rounded-full font-mono">
        <motion.div
          className="h-full bg-[var(--accent-blue)] rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((step + 1) / frames.length) * 100}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Audio-video playback dashboard */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          aria-label="Step back"
          className="rounded-xl border border-[var(--border)] p-2.5 transition hover:bg-[var(--border)]"
        >
          <SkipBack size={16} />
        </button>
        <button
          onClick={() => setPlaying(p => !p)}
          aria-label={playing ? 'Pause' : 'Play'}
          className="rounded-xl border border-[var(--accent-blue)] p-2.5 text-[var(--accent-blue)] transition hover:bg-[var(--accent-blue)]/10"
        >
          {playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button
          onClick={() => setStep(s => Math.min(maxSteps, s + 1))}
          aria-label="Step forward"
          className="rounded-xl border border-[var(--border)] p-2.5 transition hover:bg-[var(--border)]"
        >
          <SkipForward size={16} />
        </button>
        <button
          onClick={() => {
            setPlaying(false)
            setStep(0)
          }}
          aria-label="Reset"
          className="rounded-xl border border-[var(--border)] p-2.5 transition hover:bg-[var(--border)]"
        >
          <RotateCcw size={16} />
        </button>

        <span className="text-xs text-[var(--muted-foreground)] font-semibold font-mono">
          Step {step + 1} / {frames.length}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-[var(--muted-foreground)]" />
          <input
            type="range"
            min={0.5}
            max={3}
            step={0.5}
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            className="w-24 accent-[var(--accent-blue)] cursor-pointer"
          />
          <span className="w-8 text-xs text-[var(--muted-foreground)] font-bold">{speed}×</span>
        </div>
      </div>

      {/* Reference implementation / explanation tabs */}
      <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex border-b border-[var(--border)]">
          {([['code', <Code2 size={14} key="code-ico" />, 'Code'], ['explanation', <BookOpen size={14} key="exp-ico" />, 'Explanation']] as const).map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                tab === key
                  ? 'border-b-2 border-[var(--accent-blue)] text-[var(--foreground)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {tab === 'code' ? (
            <SyntaxHighlighter
              language={lang}
              style={githubGist}
              customStyle={{ background: 'transparent', fontSize: '0.8rem', padding: 0, margin: 0 }}
            >
              {src}
            </SyntaxHighlighter>
          ) : (
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              {EXPLANATIONS[algo.slug] ?? DEFAULT_EXPLANATION}
            </p>
          )}
        </div>
      </div>

      <AskDoubt slug={algo.slug} algorithm={algo.name} explanation={EXPLANATIONS[algo.slug] ?? DEFAULT_EXPLANATION} />
    </div>
  )
}
