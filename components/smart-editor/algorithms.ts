export interface AlgorithmDef {
  id: string;
  title: string;
  category: string;
  description: string;
  input: string;
  output: string;
  starterCode: Record<string, string>;
}

export const ALGORITHMS: AlgorithmDef[] = [
  {
    id: "linear-search",
    title: "Linear Search",
    category: "Searching",
    description: "Find an element in an array by checking each element sequentially.",
    input: "An array of integers `arr` and a target value `x`.",
    output: "The index of `x` if found, otherwise `-1`.",
    starterCode: {
      c: "#include <stdio.h>\n\nint linearSearch(int arr[], int n, int x) {\n    // Implementation here\n}\n\nint main() {\n    int arr[] = {2, 3, 4, 10, 40};\n    int x = 10;\n    int n = sizeof(arr) / sizeof(arr[0]);\n    return 0;\n}\n",
      cpp: "#include <iostream>\nusing namespace std;\n\nint linearSearch(int arr[], int n, int x) {\n    // Implementation here\n}\n\nint main() {\n    int arr[] = {2, 3, 4, 10, 40};\n    int x = 10;\n    int n = sizeof(arr) / sizeof(arr[0]);\n    return 0;\n}\n",
      javascript: "function linearSearch(arr, x) {\n    // Implementation here\n}\n\nconst arr = [2, 3, 4, 10, 40];\nconst x = 10;\n",
      python: "def linear_search(arr, x):\n    # Implementation here\n    pass\n\narr = [2, 3, 4, 10, 40]\nx = 10\n",
      java: "public class Main {\n    public static int linearSearch(int arr[], int x) {\n        // Implementation here\n        return -1;\n    }\n    public static void main(String args[]) {\n        int arr[] = {2, 3, 4, 10, 40};\n        int x = 10;\n    }\n}\n"
    }
  },
  {
    id: "binary-search",
    title: "Binary Search",
    category: "Searching",
    description: "Find an element in a sorted array by repeatedly dividing the search interval in half.",
    input: "A sorted array `arr` and a target value `x`.",
    output: "The index of `x` if found, otherwise `-1`.",
    starterCode: {
      c: "#include <stdio.h>\n\nint binarySearch(int arr[], int l, int r, int x) {\n    // Implementation here\n}\n\nint main() {\n    int arr[] = {2, 3, 4, 10, 40};\n    int n = sizeof(arr) / sizeof(arr[0]);\n    int x = 10;\n    return 0;\n}\n",
      cpp: "#include <iostream>\nusing namespace std;\n\nint binarySearch(int arr[], int l, int r, int x) {\n    // Implementation here\n}\n\nint main() {\n    int arr[] = {2, 3, 4, 10, 40};\n    int n = sizeof(arr) / sizeof(arr[0]);\n    int x = 10;\n    return 0;\n}\n",
      javascript: "function binarySearch(arr, l, r, x) {\n    // Implementation here\n}\n\nconst arr = [2, 3, 4, 10, 40];\nconst x = 10;\n",
      python: "def binary_search(arr, l, r, x):\n    # Implementation here\n    pass\n\narr = [2, 3, 4, 10, 40]\nx = 10\n",
      java: "public class Main {\n    public static int binarySearch(int arr[], int l, int r, int x) {\n        // Implementation here\n        return -1;\n    }\n    public static void main(String args[]) {\n        int arr[] = {2, 3, 4, 10, 40};\n        int x = 10;\n    }\n}\n"
    }
  },
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    category: "Sorting",
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    input: "An unsorted array of numbers.",
    output: "The same array, sorted in ascending order.",
    starterCode: {
      c: "#include <stdio.h>\n\nvoid swap(int *xp, int *yp) {\n    int temp = *xp;\n    *xp = *yp;\n    *yp = temp;\n}\n\nvoid bubbleSort(int arr[], int n) {\n    // Implementation here\n}\n\nint main() {\n    int arr[] = {64, 34, 25, 12, 22, 11, 90};\n    int n = sizeof(arr)/sizeof(arr[0]);\n    return 0;\n}\n",
      cpp: "#include <iostream>\nusing namespace std;\n\nvoid bubbleSort(int arr[], int n) {\n    // Implementation here\n}\n\nint main() {\n    int arr[] = {64, 34, 25, 12, 22, 11, 90};\n    int n = sizeof(arr)/sizeof(arr[0]);\n    return 0;\n}\n",
      javascript: "function bubbleSort(arr) {\n    // Implementation here\n}\n\nconst arr = [64, 34, 25, 12, 22, 11, 90];\n",
      python: "def bubble_sort(arr):\n    # Implementation here\n    pass\n\narr = [64, 34, 25, 12, 22, 11, 90]\n",
      java: "public class Main {\n    public static void bubbleSort(int arr[]) {\n        // Implementation here\n    }\n    public static void main(String args[]) {\n        int arr[] = {64, 34, 25, 12, 22, 11, 90};\n    }\n}\n"
    }
  },
  {
    id: "two-sum",
    title: "Two Sum",
    category: "Arrays",
    description: "Given an array of integers and an integer target, return indices of the two numbers such that they add up to target.",
    input: "An array of numbers `nums` and an integer `target`.",
    output: "An array containing the two indices `[index1, index2]`.",
    starterCode: {
      c: "#include <stdio.h>\n\nvoid twoSum(int arr[], int n, int target) {\n    // Implementation here\n}\n\nint main() {\n    int arr[] = {2, 7, 11, 15};\n    int target = 9;\n    int n = 4;\n    return 0;\n}\n",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Implementation here\n}\n\nint main() {\n    vector<int> nums = {2, 7, 11, 15};\n    int target = 9;\n    return 0;\n}\n",
      javascript: "function twoSum(nums, target) {\n    // Implementation here\n}\n\nconst nums = [2, 7, 11, 15];\nconst target = 9;\n",
      python: "def two_sum(nums, target):\n    # Implementation here\n    pass\n\nnums = [2, 7, 11, 15]\ntarget = 9\n",
      java: "public class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        // Implementation here\n        return new int[]{};\n    }\n    public static void main(String args[]) {\n        int[] nums = {2, 7, 11, 15};\n        int target = 9;\n    }\n}\n"
    }
  },
  {
    id: "merge-sort",
    title: "Merge Sort",
    category: "Sorting",
    description: "An efficient, stable, divide-and-conquer sorting algorithm.",
    input: "An unsorted array of numbers.",
    output: "The same array, sorted in ascending order.",
    starterCode: {
      c: "#include <stdio.h>\n\nvoid mergeSort(int arr[], int l, int r) {\n    // Implementation here\n}\n\nint main() {\n    int arr[] = {12, 11, 13, 5, 6, 7};\n    int arr_size = sizeof(arr) / sizeof(arr[0]);\n    return 0;\n}\n",
      cpp: "#include <iostream>\nusing namespace std;\n\nvoid mergeSort(int arr[], int l, int r) {\n    // Implementation here\n}\n\nint main() {\n    int arr[] = {12, 11, 13, 5, 6, 7};\n    int arr_size = sizeof(arr) / sizeof(arr[0]);\n    return 0;\n}\n",
      javascript: "function mergeSort(arr) {\n    // Implementation here\n}\n\nconst arr = [12, 11, 13, 5, 6, 7];\n",
      python: "def merge_sort(arr):\n    # Implementation here\n    pass\n\narr = [12, 11, 13, 5, 6, 7]\n",
      java: "public class Main {\n    public static void mergeSort(int arr[], int l, int r) {\n        // Implementation here\n    }\n    public static void main(String args[]) {\n        int arr[] = {12, 11, 13, 5, 6, 7};\n    }\n}\n"
    }
  },
  {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    category: "Linked Lists",
    description: "Reverse a singly linked list.",
    input: "The head node of a singly linked list.",
    output: "The head node of the reversed linked list.",
    starterCode: {
      c: "#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node* next;\n};\n\nstruct Node* reverseList(struct Node* head) {\n    // Implementation here\n    return NULL;\n}\n\nint main() {\n    // Setup and test code\n    return 0;\n}\n",
      cpp: "#include <iostream>\nusing namespace std;\n\nstruct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(NULL) {}\n};\n\nListNode* reverseList(ListNode* head) {\n    // Implementation here\n    return NULL;\n}\n\nint main() {\n    return 0;\n}\n",
      javascript: "class ListNode {\n    constructor(val = 0, next = null) {\n        this.val = val;\n        this.next = next;\n    }\n}\n\nfunction reverseList(head) {\n    // Implementation here\n}\n",
      python: "class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head):\n    # Implementation here\n    pass\n",
      java: "class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int x) { val = x; }\n}\n\npublic class Main {\n    public static ListNode reverseList(ListNode head) {\n        // Implementation here\n        return null;\n    }\n    public static void main(String args[]) {\n    }\n}\n"
    }
  },
  {
    id: "palindrome-check",
    title: "Palindrome Check",
    category: "Strings",
    description: "Check if a given string reads the same forward and backward.",
    input: "A string `s`.",
    output: "`true` if the string is a palindrome, `false` otherwise.",
    starterCode: {
      c: "#include <stdio.h>\n#include <string.h>\n#include <stdbool.h>\n\nbool isPalindrome(char* str) {\n    // Implementation here\n    return false;\n}\n\nint main() {\n    char str[] = \"racecar\";\n    return 0;\n}\n",
      cpp: "#include <iostream>\n#include <string>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    // Implementation here\n    return false;\n}\n\nint main() {\n    string str = \"racecar\";\n    return 0;\n}\n",
      javascript: "function isPalindrome(s) {\n    // Implementation here\n}\n\nconst str = \"racecar\";\n",
      python: "def is_palindrome(s):\n    # Implementation here\n    pass\n\ns = \"racecar\"\n",
      java: "public class Main {\n    public static boolean isPalindrome(String s) {\n        // Implementation here\n        return false;\n    }\n    public static void main(String args[]) {\n        String str = \"racecar\";\n    }\n}\n"
    }
  }
];
