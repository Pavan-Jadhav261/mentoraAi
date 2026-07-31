import { ALGORITHMS, type CodeBlock } from '@/lib/dummy-data'

type Lesson = { code: string; explanation: string; blockHelp: string[] }

const lessons: Record<string, Lesson> = {
  'quick-sort': { code: `function quickSort(items) {
  if (items.length <= 1) return items;
  const pivot = items[items.length - 1];

  const smaller = items.slice(0, -1).filter(item => item <= pivot);
  const bigger = items.slice(0, -1).filter(item => item > pivot);

  return [...quickSort(smaller), pivot, ...quickSort(bigger)];
}` , explanation: 'Imagine choosing one toy as the captain. Put all smaller toys on its left and bigger toys on its right. Then let each little group play the same game until every toy is in the right line.', blockHelp: ['Start the sorter and stop when a group is tiny.', 'Choose the last item to be our captain, called the pivot.', 'Make a left basket and a right basket.', 'Sort both baskets and place the captain between them.'] },
  'merge-sort': { code: `function mergeSort(items) {
  if (items.length <= 1) return items;
  const middle = Math.floor(items.length / 2);

  const left = mergeSort(items.slice(0, middle));
  const right = mergeSort(items.slice(middle));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  while (left.length && right.length) result.push(left[0] <= right[0] ? left.shift()! : right.shift()!);
  return [...result, ...left, ...right];
}` , explanation: 'Pretend a messy pile of cards is too hard to sort. Split it into two little piles, then split again until each pile has one card. One-card piles are already sorted! Now gently pick the smallest top card from each pair of piles until they become one neat line.', blockHelp: ['Start the function and stop when there is only one card.', 'Find the middle so we can cut the pile in half.', 'Ask the same helper to sort the left and right piles.', 'Put the two neat piles together with the merge helper.', 'Start a helper with an empty tray for the cards.', 'Keep taking the smaller front card, then add the leftovers.'] },
  'heap-sort': { code: `function heapSort(items) {
  const result = [];
  const heap = [...items];

  heap.sort((a, b) => b - a);

  while (heap.length) result.unshift(heap.shift()!);
  return result;
}` , explanation: 'Think of a prize tower where the biggest number always stands on top. We take the champion off the top again and again. Putting each champion at the end makes a small-to-big line.', blockHelp: ['Make a new result line and copy the toys.', 'Arrange the copy so the biggest toy is first.', 'Take the champion each time and put it at the front of the answer.', 'Give back the finished sorted line.'] },
  'insertion-sort': { code: `function insertionSort(items) {
  const result = [...items];

  for (let index = 1; index < result.length; index++) {
    const card = result[index];
    let spot = index - 1;

    while (spot >= 0 && result[spot] > card) {
      result[spot + 1] = result[spot];
      spot--;
    }
    result[spot + 1] = card;
  }
  return result;
}` , explanation: 'This is like putting playing cards into your hand. Pick up one new card, slide bigger cards over, and tuck the new card into its cozy spot.', blockHelp: ['Copy the cards so the original stays safe.', 'Pick the next card to place.', 'Remember the card and look just to its left.', 'Slide bigger cards to the right until there is room.', 'Put the saved card into its new home, then return the line.'] },
  'bubble-sort': { code: `function bubbleSort(items) {
  const result = [...items];

  for (let pass = 0; pass < result.length - 1; pass++) {
    for (let index = 0; index < result.length - 1 - pass; index++) {
      if (result[index] > result[index + 1]) [result[index], result[index + 1]] = [result[index + 1], result[index]];
    }
  }
  return result;
}` , explanation: 'Two neighbors look at each other. If the bigger one is on the left, they swap seats. The biggest number keeps drifting right, like a bubble floating to the top.', blockHelp: ['Copy the list before changing it.', 'Repeat enough passes to settle every number.', 'Look at each neighboring pair that is still unsorted.', 'Swap a pair only when the bigger one is on the left.', 'Return the neat line.'] },
  'binary-search': { code: `function binarySearch(items, target) {
  let left = 0;
  let right = items.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    if (items[middle] === target) return middle;
    if (items[middle] < target) left = middle + 1;
    else right = middle - 1;
  }
  return -1;
}` , explanation: 'Use this with numbers already in order. Peek at the middle number. If it is too small, throw away the whole left half; if it is too big, throw away the whole right half. That is much faster than checking every number.', blockHelp: ['Place two fingers at the ends of the sorted list.', 'Keep looking while there is space between your fingers.', 'Find the middle and celebrate if it is the target.', 'Move one finger to throw away the impossible half.', 'Say -1 when the target is not in the list.'] },
  'linear-search': { code: `function linearSearch(items, target) {
  for (let index = 0; index < items.length; index++) {
    if (items[index] === target) return index;
  }
  return -1;
}` , explanation: 'This is a treasure hunt. Look at the first box, then the next box, and keep going until you find the treasure. It works even when the boxes are messy.', blockHelp: ['Start the treasure hunt with the list and target.', 'Visit every position one at a time.', 'Stop immediately when a box has the target.', 'Say -1 only after every box was checked.'] },
  bfs: { code: `function bfs(graph, start) {
  const queue = [start];
  const seen = new Set([start]);
  const order = [];

  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    for (const neighbor of graph[node]) {
      if (!seen.has(neighbor)) { seen.add(neighbor); queue.push(neighbor); }
    }
  }
  return order;
}` , explanation: 'Imagine dropping a pebble in water. BFS visits all friends one step away first, then friends two steps away. A queue is like a line at a slide: first in line gets a turn first.', blockHelp: ['Put the start friend in a waiting line and mark them seen.', 'Keep helping while someone is waiting.', 'Take the first friend in line and remember the visit.', 'Add each new neighbor to the back of the line.', 'Return the visiting order.'] },
  dfs: { code: `function dfs(graph, start) {
  const seen = new Set();
  const order = [];

  function visit(node) {
    if (seen.has(node)) return;
    seen.add(node); order.push(node);
    for (const neighbor of graph[node]) visit(neighbor);
  }

  visit(start);
  return order;
}` , explanation: 'DFS is like walking down one hallway until it ends, then walking back to try another hallway. A little helper remembers every room it has already visited.', blockHelp: ['Prepare a notebook for seen rooms and the visit order.', 'Make a helper that visits one room.', 'Skip rooms already written in the notebook.', 'Write the room, then let the helper explore every neighbor.', 'Start at the first room and return the trip.'] },
  dijkstra: { code: `function dijkstra(graph, start) {
  const distance = Object.fromEntries(Object.keys(graph).map(node => [node, Infinity]));
  distance[start] = 0;
  const todo = [start];

  while (todo.length) {
    const node = todo.shift()!;
    for (const [next, cost] of graph[node]) {
      const newDistance = distance[node] + cost;
      if (newDistance < distance[next]) { distance[next] = newDistance; todo.push(next); }
    }
  }
  return distance;
}` , explanation: 'Imagine roads with different numbers of steps. Start with zero steps at home. Whenever you find a shorter way to a friend, erase the old big number and write the smaller number.', blockHelp: ['Give every place an enormous distance, except the start.', 'Put the start place on the to-do list.', 'Take a place and look at all roads leaving it.', 'Replace a neighbor’s distance when this road makes a shorter trip.', 'Return the best distances we discovered.'] },
  'tree-traversals': { code: `function inOrder(node, result = []) {
  if (!node) return result;

  inOrder(node.left, result);
  result.push(node.value);
  inOrder(node.right, result);

  return result;
}` , explanation: 'A tree is like a family tree. For in-order visiting, first say hello to everyone on the left, then the parent, then everyone on the right.', blockHelp: ['Start a helper with a place to remember values.', 'Stop when there is no node to visit.', 'Visit the whole left family first.', 'Write down this node, then visit the right family.', 'Return the remembered values.'] },
  'bst-insert-delete': { code: `function insert(node, value) {
  if (!node) return { value, left: null, right: null };

  if (value < node.value) node.left = insert(node.left, value);
  else if (value > node.value) node.right = insert(node.right, value);

  return node;
}` , explanation: 'A BST is a tidy number tree. Smaller numbers always go left and bigger numbers always go right. We walk down until we find an empty branch, then plant a new leaf there.', blockHelp: ['Start the insert helper with a node and new value.', 'Make a new leaf when the branch is empty.', 'Walk left for a smaller value and right for a bigger value.', 'Hand the tree back after the new leaf is planted.'] },
  'fibonacci-memo': { code: `function fibonacci(number, memo = {}) {
  if (number in memo) return memo[number];
  if (number < 2) return number;

  memo[number] = fibonacci(number - 1, memo) + fibonacci(number - 2, memo);
  return memo[number];
}` , explanation: 'Fibonacci adds the two numbers before it. Instead of doing the same homework again and again, memo is a little notebook. Once we know an answer, we write it down and use it next time.', blockHelp: ['Start with a notebook for saved answers.', 'Use a saved answer straight away.', 'Know that 0 and 1 are tiny base answers.', 'Add the two earlier answers and save the new one.', 'Give back the saved answer.'] },
  knapsack: { code: `function knapsack(items, capacity) {
  const best = Array(capacity + 1).fill(0);

  for (const { weight, value } of items) {
    for (let space = capacity; space >= weight; space--) {
      best[space] = Math.max(best[space], best[space - weight] + value);
    }
  }
  return best[capacity];
}` , explanation: 'You have a backpack that can hold only so much weight. For every toy, ask: “Is my backpack happier without it, or with it?” The table remembers the best treasure for each amount of space.', blockHelp: ['Make a row that remembers the best value for every backpack size.', 'Look at one item at a time.', 'Try sizes backwards so one item is not used twice.', 'Keep whichever choice gives more value.', 'Return the answer for the full backpack.'] },
  'n-queens': { code: `function solveQueens(size) {
  const board = [];

  function place(row) {
    if (row === size) return true;
    for (let column = 0; column < size; column++) {
      if (board.every(([r, c]) => c !== column && Math.abs(r - row) !== Math.abs(c - column))) {
        board.push([row, column]);
        if (place(row + 1)) return true;
        board.pop();
      }
    }
    return false;
  }

  place(0);
  return board;
}` , explanation: 'Queens do not like sharing a row, column, or diagonal. Put one queen down, then try the next row. If there is no safe spot, pick the last queen back up and try a different square.', blockHelp: ['Make an empty board for queen positions.', 'Create a helper for placing one row at a time.', 'Celebrate when every row has a safe queen.', 'Try each square and check it is safe from every older queen.', 'Place a queen, try the next row, and undo it if needed.', 'Begin at row zero and return the solution.'] },
}

export const ALGORITHM_CODE: Record<string, { js: string }> = Object.fromEntries(Object.entries(lessons).map(([slug, lesson]) => [slug, { js: lesson.code }]))
export const CHILD_EXPLANATIONS: Record<string, string> = Object.fromEntries(Object.entries(lessons).map(([slug, lesson]) => [slug, lesson.explanation]))

export const ALGORITHM_CHALLENGES: Record<string, { title: string; language: string; blocks: CodeBlock[] }> = Object.fromEntries(ALGORITHMS.map(algorithm => {
  const lesson = lessons[algorithm.slug]
  const lines = lesson.code.split('\n')
  const blockCount = 6
  const pieces = Array.from({ length: blockCount }, (_, index) => {
    const start = Math.floor((index * lines.length) / blockCount)
    const end = Math.floor(((index + 1) * lines.length) / blockCount)
    return lines.slice(start, end).join('\n')
  })
  const guidance = [
    'Begin with the main function and its inputs.',
    'Set up the helper values the algorithm needs.',
    'Start the main loop or decision that moves the work forward.',
    'Handle the important comparison or smaller sub-task next.',
    'Finish the repeated work and close the right code sections.',
    'Return the final answer after all the work is complete.',
  ]
  return [algorithm.slug, { title: `${algorithm.name} — JavaScript`, language: 'javascript', blocks: pieces.map((code, correctIndex) => ({ id: `${algorithm.slug}-${correctIndex}`, code, description: lesson.blockHelp[correctIndex] ?? guidance[correctIndex], correctIndex })) }]
}))
