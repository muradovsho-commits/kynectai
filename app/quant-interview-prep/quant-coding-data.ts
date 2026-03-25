export const QUANT_CODING_SECTIONS = [
  {
    title: `1. Time & Space Complexity (Big O Notation)`,
    content: `<p>If you are applying for a Quantitative Developer or Algorithmic Trader role, your coding skills must be exceptionally optimized. An algorithm that runs in $O(N^2)$ is utterly useless in High-Frequency Trading (HFT) where microseconds literally equal millions of dollars.</p>
<br/>
<p><strong>The Hierarchy of Speeds:</strong></p>
<p>• $O(1)$ [Constant]: The holy grail. Array indexing, Hash Map lookups. No matter how large the dataset, execution time is identical.</p>
<p>• $O(\\log N)$ [Logarithmic]: Binary Search, balanced search trees. Very fast.</p>
<p>• $O(N)$ [Linear]: Iterating through an array sequentially. Used for single-pass algorithms.</p>
<p>• $O(N \\log N)$ [Linearithmic]: Merge Sort, Quick Sort (average case). The fundamental speed limit of generic comparison sorting.</p>
<p>• $O(N^2)$ [Quadratic]: Bubble Sort, nested double-loops. Generally an automatic failure in interviews unless it's a brute-force baseline.</p>
<br/>
<p>Before ever writing code on a whiteboard or in an IDE format, ALWAYS verbally state the brute-force complexity, and then explicitly lay out your plan to reduce the Time Complexity (often by trading off Space Complexity using a Hash Map).</p>`
  },
  {
    title: `2. Core Data Structures for Trading Systems`,
    content: `<p>Certain data structures act as the invisible backbone for quantitative trading systems mapping market data.</p>
<br/>
<p><strong>1. Hash Maps (Dictionaries): $O(1)$</strong><br/>
The most universally useful structure. You will use these constantly to track portfolio positions, map ticker symbols string-keys to real-time price objects, and perform fast frequency caching.</p>
<br/>
<p><strong>2. Heaps (Priority Queues): Min / Max</strong><br/>
A Min-Heap or Max-Heap allows you to find the minimum or maximum element in $O(1)$ time, and insert/delete in $O(\\log N)$ time. Why is this critical? Because modern Limit Order Books are essentially just two Priority Queues: a Max-Heap for tracking the highest Bid prices, and a Min-Heap for tracking the lowest Ask prices.</p>
<br/>
<p><strong>3. Trees (Tries / Prefix Trees):</strong><br/>
Used for hierarchical data and high-speed string prefix-searching. A Trie is heavily used if you need to rapidly search through millions of option or futures contract names matching a specific ticker prefix (e.g. searching "AAPL" to fetch all strike-price variants recursively).</p>`
  },
  {
    title: `3. Dynamic Programming (DP) & Optimization`,
    content: `<p>Dynamic Programming (DP) is an algorithm design technique used to solve complex problems by breaking them down into simpler overlapping subproblems, and storing the results of those subproblems to avoid redundant calculations. In trading operations, computational redundancy is death.</p>
<br/>
<p><strong>Top-Down (Memoization) vs. Bottom-Up (Tabulation):</strong><br/>
Memoization involves writing a recursive function that checks a cache (Hash Map) before computing a subproblem. Tabulation involves iteratively building a 1D or 2D array from the base case $0$ up to the final required answer.</p>
<br/>
<p><strong>Classic Finance Variant: Maximum Subarray Sum (Kadane's Algorithm)</strong><br/>
"Given a time series of daily P&L changes, find the contiguous contiguous subarray representing the maximum possible portfolio gain."<br/>
Brute forcing all start/end combinations $O(N^2)$ takes too long. Kadane's Algorithm solves this in $O(N)$ time and $O(1)$ space by maintaining a running \`current_max\` that resets to 0 if it drops negative, and comparing it to a \`global_max\` on each step.</p>`
  },
  {
    title: `4. Building a Limit Order Book (The Ultimate Quant Test)`,
    content: `<p>This is the definitive "Case Study" of Quant Software Developer interviews. You will be asked to architect a simplified matching engine or Limit Order Book (LOB).</p>
<br/>
<p><strong>The Requirements (The 3 Operations):</strong><br/>
You need to support three operations with minimal latency:<br/>
1. Submit Order (Buy or Sell, Limit Price, Size)<br/>
2. Cancel Order (Target by ID)<br/>
3. Execute Trade (Matching Best Bid against Best Ask internally).</p>
<br/>
<p><strong>The Optimal Architecture:</strong><br/>
You cannot use standard arrays because insertion and deletion in the middle takes massive $O(N)$ time. The optimal structure is an interlocking combination: <br/>
1. A **Hash Map** that maps a highly-specific \`Order ID\` integer to a memory pointer representing that exact order (Enables $O(1)$ cancellations).<br/>
2. A **Doubly-Linked List** representing the execution queue at a *specific* price level.<br/>
3. A **Balanced Binary Search Tree (Red-Black Tree)** or **Heaps** maintaining the ordered hierarchy of all the currently active price levels. This allows you to find the absolute Best Bid/Ask in $O(1)$ time and execute sequentially against the linked lists.</p>`
  },
  {
    title: `5. Concurrency & Multi-threading`,
    content: `<p>Modern algorithmic trading relies heavily on parallel processing. You must understand how to navigate concurrent state without locking your entire system.</p>
<br/>
<p><strong>Race Conditions & Mutexes:</strong><br/>
A race condition occurs when two threads access shared data simultaneously and try to alter it (e.g., two execution threads trying to drain the same liquidity pool on an order book). A Mutual Exclusion lock (Mutex) is used to protect critical code sections. However, in HFT, heavy mutex locking slows down the critical path drastically.</p>
<br/>
<p><strong>Lock-Free Data Structures:</strong><br/>
A massively common interview topic for C++ roles. Can you architect a queue that multiple threads can push/pop from without utilizing a blocking Mutex? This involves relying on hardware-level CPU operations like Compare-And-Swap (CAS) and understanding cache-line memory barriers.</p>`
  },
  {
    title: `6. C++ Specifics & Memory Management`,
    content: `<p>If you code in C++, you will be grilled on systems-level architecture.</p>
<br/>
<p><strong>The Stack vs. The Heap:</strong><br/>
• <em>The Stack:</em> Very fast, deterministic memory allocation managed directly by the CPU pointer. Used for local variables.<br/>
• <em>The Heap:</em> Slower, dynamic memory allocation. You must manually call \`new\` and \`delete\`. Overusing heap allocation during a real-time trading loop creates latency spikes and memory fragmentation.</p>
<br/>
<p><strong>Virtual Functions & V-Tables:</strong><br/>
Understand the cost of polymorphism. Calling a \`virtual\` function requires a pointer lookup in a V-Table, causing an indirect jump that destroys branch prediction and incurs cache misses. Low-latency HFT C++ avoids virtual runtime polymorphism entirely, favoring compile-time templates (CRTP).</p>`
  }
];
