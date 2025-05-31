+++
date = '2025-05-22T20:58:14+08:00'
draft = false
title = '代码随想录_day9'
math = true
image = "img/code.jpg"
license = false
categories = [
  "代码随想录",
  "c++"
]
+++
代码仓库: <https://github.com/Sophomoresty/Algorithm_Exercises.git>

## 4_翻转字符串里的单词_leetcode_151

```cpp
#include <algorithm>
#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    string reverseWords(string s) {
        // 1.去除空格
        int slow, fast;
        for (slow = fast = 0; fast < s.size(); fast++) {
            // fast遇到的不是空格, 也就是我们要加入新数组中的元素
            // 除了第一个单词, 其余单词的首字母前面都要加个空格
            if (s[fast] != ' ') {
                // 处理首字母
                // slow==0, 意味着此时加入的是第1个单词
                if (slow == 0) {
                    s[slow++] = s[fast++];
                }
                // slow !=0
                else {
                    s[slow++] = ' ';
                }
                // 处理该单词剩余的字母, 这里主要fast不要超出s.size()
                while (fast < s.size() && s[fast] != ' ') {
                    s[slow++] = s[fast++];
                }
            }
        }
        // slow是新字符串的长度
        s.resize(slow);

        // 反转整个字符串, 再反转每个不含空格的子串

        // 2.反转整个字符串
        reverse(s.begin(), s.end());
        // 现在是反转空格隔开的子串
        int begin = 0;
        // 3.反转子串
        for (int i = 0; i < s.size(); i++) {
            // 最后一个单词后面没有空格
            if (s[i] == ' ') {
                reverse(s.begin() + begin, s.begin() + i);
                begin = i + 1;
                // 反转后更新字符串的起始点
            }
            if (i == s.size() - 1) {
                reverse(s.begin() + begin, s.end());
            }
        }
        return s;
    }
};

int main() {
    string s = "   the       sky       is blue!              ";
    Solution sol;
    string s_res = sol.reverseWords(s);
    cout << s_res << '\n';
}
```

## 5_右旋字符

```cpp
#include <algorithm>
#include <iostream>
#include <string>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    int k;
    string s;
    cin >> k;
    cin >> s;
    reverse(s.begin(), s.end());
    reverse(s.begin(), s.begin() + k);
    reverse(s.begin() + k, s.end());
    cout << s << '\n';
}

```

## 6_实现strStr_leetcode_28 非常重要

### 1. KMP 算法的核心思想

1. **目标：** 在主串 `haystack` 中查找模式串 `needle` 的第一次出现位置。
2. **朴素算法的低效：** 当模式串失配时，朴素算法会同时回溯主串和模式串指针，导致重复比较。
3. **KMP 的优化：**
    * 在失配时，**不回溯主串指针 `i`**。
    * 仅仅根据模式串自身的结构信息（通过 `next` 数组），高效地**回溯模式串指针 `j`**，让模式串在主串上“滑动”，避免重复比较，从而实现线性的时间复杂度。

### 2. `next` 数组 (LPS 数组) 的构建 (`get_next` 函数)

`next` 数组是 KMP 算法的“灵魂”，它存储了模式串自身的匹配信息，用于指导失配时的回溯。

1. **真前缀 (Proper Prefix) 与 真后缀 (Proper Suffix) 的含义：**
    * **真前缀：** 指一个字符串**不包括其自身**的所有前缀。
        * 例如，对于字符串 `"abc"`：
            * 前缀有：`""` (空字符串), `"a"`, `"ab"`, `"abc"`
            * **真前缀**有：`""`, `"a"`, `"ab"`
    * **真后缀：** 指一个字符串**不包括其自身**的所有后缀。
        * 例如，对于字符串 `"abc"`：
            * 后缀有：`""` (空字符串), `"c"`, `"bc"`, `"abc"`
            * **真后缀**有：`""`, `"c"`, `"bc"`

2. **`next[i]` 的精确含义：**
    * `next[i]` 表示模式串 `needle` 中，**以 `i` 为结尾字符**的**前缀子串 `needle[0...i]`**，它**最长相等真前缀和真后缀的长度**。
    * **示例：** 对于 `needle = "ababa"`：
        * `next[0]` (for `"a"`) = 0
        * `next[1]` (for `"ab"`) = 0
        * `next[2]` (for `"aba"`) = 1 (因为 `"a"` 是 `"aba"` 最长相等的真前缀和真后缀)
        * `next[3]` (for `"abab"`) = 2 (因为 `"ab"` 是 `"abab"` 最长相等的真前缀和真后缀)
        * `next[4]` (for `"ababa"`) = 3 (因为 `"aba"` 是 `"ababa"` 最长相等的真前缀和真后缀)
    * 所以 `next` 数组是 `[0, 0, 1, 2, 3]`。
    * **区分：** 我们也讨论了 KMP `next` 数组存在多种定义（如标准 LPS 数组与优化 `nextval`），但核心思想一致，且要求在构建和匹配阶段保持一致性。在 LeetCode 和大多数竞赛中，标准 LPS 数组是主流。

3. **`get_next` 函数的核心逻辑：**
    * **初始化：** `next[0] = 0;` (长度为1的前缀没有公共前后缀)。`j = 0;` (`j` 初始代表长度为0的空前缀)。
    * **`for (int i = 1; i < n; ++i)`：** `i` 遍历模式串，`next[i]` 的值依赖于 `needle[0...i-1]` 的信息。
    * **`j` 的双重身份（长度与索引）：**
        * `j` 的值代表当前已找到的**最长公共前后缀的长度**。
        * `j` 的值也作为**索引**，指向模式串中，这个最长公共前后缀**之后**的那个字符 (`needle[j]`)，它是我们用来与 `needle[i]` 比较的字符。
    * **`while (j > 0 && needle[i] != needle[j]) { j = next[j - 1]; }` (回溯 `j` - **关键**)：**
        * **时机：** 当 `needle[i]` (当前后缀字符) 与 `needle[j]` (当前前缀字符) 不匹配，且 `j` 大于 `0` (还有更短的公共前后缀可以回溯) 时。
        * **作用：** 将 `j` 回溯到 `next[j-1]` 的位置。`next[j-1]` 存储的是 `needle[0...j-1]` 这个前缀的**次长公共前后缀的长度**。这个 `while` 循环会持续回溯，直到 `j` 归零，或找到一个可以匹配 `needle[i]` 的 `needle[j]`。
        * **意义：** 这种回溯是有策略的，它利用了模式串自身的重复结构，避免了盲目回溯到 `0`。
    * **`if (needle[i] == needle[j]) { j++; }` (匹配扩展)：**
        * **时机：** 当 `needle[i]` 和回溯后的 `needle[j]` 匹配时。
        * **作用：** `j++`，表示最长公共前后缀的长度增加了 1。这个新长度 `j` 将是 `next[i]` 的值。
    * **`next[i] = j;`：** 存储本轮计算出的 `j` 值。

### 3. KMP 匹配过程 (`strStr` 函数)

在构建完 `next` 数组后，KMP 匹配过程本身相对直观，也使用了类似的双指针和回溯逻辑。

1. **初始化：** `i = 0` (主串指针)，`j = 0` (模式串指针/已匹配长度)。
2. **主循环：** `for (int i = 0; i < haystack.size(); i++)`。
3. **`while (j > 0 && haystack[i] != needle[j]) { j = next[j - 1]; }` (失配回溯)：**
    * **时机：** 当 `haystack[i]` (主串当前字符) 与 `needle[j]` (模式串当前字符) 不匹配，且 `j > 0` 时。
    * **作用：** `j` 回溯到 `next[j-1]`。这意味着我们利用了 `needle[0...j-1]` 这段**已匹配部分**的最长公共前后缀，将模式串向前滑动，让 `needle[next[j-1]]` 对齐 `haystack[i]`，避免了 `i` 的回溯。
4. **`if (haystack[i] == needle[j]) { j++; }` (匹配前进)：**
    * **时机：** 当 `haystack[i]` 和 `needle[j]` 匹配时。
    * **作用：** `j++`，表示模式串又成功匹配了一个字符。
5. **匹配成功条件：** `if (j == needle.size()) { return i - needle.size() + 1; }`
    * **判断：** 当 `j` 的值达到模式串的完整长度 (`needle.size()`) 时，表示整个模式串已经匹配成功。
    * **返回：** 匹配的起始索引是 `i - needle.size() + 1`。
6. **未找到：** 循环结束后，如果 `j` 未达到 `needle.size()`，返回 `-1`。
7. **空模式串：** `if (needle.empty()) { return 0; }` (特殊处理，通常返回 0)。

### 4. KMP 的核心原理：**`j` 维护的不变式**

KMP 算法的精妙之处在于 `j` 变量在 `get_next` 函数中维护的一个关键**循环不变量**。

**`j` 维护的不变式：**

在 `get_next` 函数中，当 `for` 循环推进到 `i` 索引时，`j` 的值（在进入 `while` 循环并可能回溯之后，但在 `if` 匹配检查之前）始终代表着：

`needle[0...j-1]` (模式串的一个前缀) 已经和 `needle[i-j...i-1]` (模式串中以 `i-1` 结尾的一个后缀) 完全匹配。

也就是说，此时 `j` 是模式串 `needle[0...i-1]` 这个前缀的最长公共前后缀的长度。

**为什么 `needle[i] == needle[j]` 意味着可以扩充长度？**

现在，我们来看当 `needle[i] == needle[j]` 发生时：

我们知道：

`needle[0...j-1]` == `needle[i-j...i-1]` （这是 `j` 的定义所保证的，即它是一个公共前后缀）

`needle[j]` == `needle[i]` （这是当前的匹配条件）

通过这两点，我们可以推导出：

`needle[0...j-1]` **后面接上** `needle[j]`

等价于

`needle[i-j...i-1]` **后面接上** `needle[i]`

也就是说：

`needle[0...j]` == `needle[i-j...i]`

这意味着什么？

`needle[0...j]` 是模式串 `needle[0...i]` 的一个真前缀。

`needle[i-j...i]` 是模式串 `needle[0...i]` 的一个真后缀。

而且，这两个真前缀和真后缀是相等的，并且它们的长度是 `j+1`。

既然 `j` 已经代表了 `needle[0...i-1]` 的最长公共前后缀的长度，并且我们现在能通过 `needle[i]` 和 `needle[j]` 的匹配将其扩展一位，那么 `j+1` 就必然是 `needle[0...i]` 的最长公共前后缀的长度。

正是对这些循环不变量的维护，使得 KMP 算法能够以其独特的“模式串滑动”方式，在 $O(N+M)$ 的时间复杂度内完成字符串匹配，这比朴素算法的 $O(NM)$ 具有显著的性能优势。

```cpp
#include <string>
#include <vector>
using namespace std;

// 本题的难点是实现 KMP 算法, KMP的难点是求出模式串的next数组
class Solution {
public:
    vector<int> get_next(const string &needle) {
        int n = needle.size();
        vector<int> next(n);
        next[0] = 0;
        int j = 0;
        for (int i = 1; i < n; i++) {
            while (j > 0 && needle[j] != needle[i]) {
                j = next[j - 1];
            }
            if (needle[i] == needle[j]) {
                j++;
            }
            next[i] = j;
        }
        return next;
    }
    int strStr(string haystack, string needle) {
        if (needle.empty()) {
            return 0;
        }
        vector<int> next = get_next(needle);
        int j = 0;
        for (int i = 0; i < haystack.size(); i++) {
            while (j > 0 && needle[j] != haystack[i]) {
                j = next[j - 1];
            }
            if (needle[j] == haystack[i]) {
                j++;
            }
            // 理解j的值, 还是从循环开始去对应
            // 比如i=0时, 匹配成功j对应的是1, 即是匹配的子串长度, 
            // 所以这里的j即表示长度
            if (j == needle.size()) {
                // 最后要返回在在haystack中的索引, 最初的索引
                return i - j + 1;
            }
        }
        return -1;
    }
};
```

## 7_重复的子字符串_leetcode_459 非常重要

这个问题要求我们判断一个非空字符串 `s` 是否能由它的一个**子串重复多次**拼接而成。解决这个问题的核心在于巧妙地运用 **KMP 算法**中计算出的 `next` 数组。

### 1. 问题核心思路：利用 `next` 数组的最后一位

1. **计算 `next` 数组：** 我们首先需要为字符串 `s` 计算出其 `next` 数组。`next[i]` 表示 `s` 中以索引 `i` 结尾的前缀子串 `s[0...i]` 的最长相等真前缀和真后缀的长度。
2. **关注 `next[n-1]`：** 字符串 `s` 的长度是 `n`。`next[n-1]`（我们称之为 `L`）代表了整个字符串 `s` 的最长相等真前缀和真后缀的长度。

### 2. 关键数学原理：`n - L` 是最小重复单元的长度

这是理解问题的最核心部分，也是我们这次讨论的重点：

* **`L` 的意义：** 如果一个字符串 `s` 能由一个子串 `sub` 重复 `k` 次构成，那么 `s` 的最长相等真前缀（即 `(k-1)` 个 `sub` 的拼接）将与它的最长相等真后缀（同样是 `(k-1)` 个 `sub` 的拼接）相等。这个最长公共前后缀的长度 `L` 就等于 `n - len_sub`，其中 `len_sub` 是 `sub` 的长度。
* **推导 `n - L`：** 通过 `n = k * len_sub` 和 `L = (k-1) * len_sub`，我们可以推导出 `n - L = len_sub`。
* **结论：** 因此，`n - L` 精确地代表了构成字符串 `s` 的**最小重复单元的长度**。

### 3. 完整的判断条件

要判断字符串 `s` 是否由重复子串构成，需要同时满足以下两个条件：

1. **`L > 0`：**
    * 这个条件确保字符串 `s` 必须拥有一个**非空的公共前后缀**。如果 `L=0`，意味着 `s` 不具备任何能构成重复模式的内部结构（例如 `abcde`）。
    * 此外，`L > 0` 还保证了 `n - L < n`，即最小重复单元的长度**小于**字符串的总长度。这就意味着 `s` 是由这个最小重复单元**重复了多于一次**（`k > 1`）构成的。

2. **`n % (n - L) == 0`：**
    * 这个条件确保字符串 `s` 的总长度 `n` 必须能被这个**最小重复单元的长度 `(n - L)` 整除**。
    * 如果能整除，就意味着 `s` 能够被这个 `(n - L)` 长度的子串**完整、无缝地重复拼接**而成。

**综合：`s.size() % (s.size() - next[s.size() - 1]) == 0 && next[s.size() - 1] > 0`**

### 4. KMP 算法的核心机制复习

1. **`next` 数组的计算 (`get_next` 函数)：**
    * **目标：** 计算 `next[i]`，即 `s[0...i]` 的最长相等真前缀和真后缀的长度。
    * **核心逻辑：** 使用两个指针 `i` 和 `j`。`i` 遍历模式串，`j` 表示当前已匹配的最长公共前后缀的长度。
        * **失配 (`needle[i] != needle[j]`)：** 当 `needle[i]` 和 `needle[j]` 不匹配时，`j` 会根据 `next[j-1]` 的值进行**回溯**。这个 `while` 循环会持续进行，直到 `j` 归零或找到新的匹配点。
        * **匹配 (`needle[i] == needle[j]`)：** 当 `needle[i]` 和 `needle[j]` 匹配时，`j` 会简单地 `j++`，表示找到了一个更长的公共前后缀。
        * **赋值：** 最终计算出的 `j` 值（代表长度）赋给 `next[i]`。
    * **`j` 的双重身份：** `j` 的值既是当前最长公共前后缀的长度，也是模式串中该最长前缀之后一个字符的索引。

2. **KMP 匹配中的 `next` 数组作用：**
    * 在主串 `haystack` 和模式串 `needle` 匹配过程中，当 `haystack[i]` 和 `needle[j]` 失配时，`j` 会回溯到 `next[j-1]`。
    * 这利用了 `needle[0...j-1]` 这段已匹配子串的内部结构，让模式串高效地“滑动”，从而避免了主串指针 `i` 的回溯，也避免了模式串从头开始的重复比较。

### 5.循环不变量与算法的优雅

* **`get_next` 函数中 `j` 的循环不变量：** 在 `for` 循环的每次迭代开始时，`j` 的值始终代表 `needle[0...i-1]` 的最长公共前后缀的长度。`while` 循环的回溯和 `if` 语句中的 `j++` 操作都是为了**维护**这个不变式。
* **`strStr` 函数中 `j` 的循环不变量：** 在 `for` 循环的每次迭代开始时，`j` 的值表示 `needle[0...j-1]` 已经和 `haystack[i-j...i-1]` 成功匹配。
* **意义：** 循环不变量是理解和设计复杂循环算法的强大工具，它提供了高层次的视角，证明算法正确性，并指导设计。

```cpp
#include <string>
#include <vector>
using namespace std;
class Solution {
public:
    bool repeatedSubstringPattern(string s) {
        // s长度大于1, 所以不需要自己判断
        int n = s.size();
        vector<int> next(n);
        next[0] = 0;
        int j = 0;
        // 得到next数组
        for (int i = 1; i < n; i++) {
            while (j > 0 && s[i] != s[j]) {
                j = next[j - 1];
            }
            if (s[i] == s[j]) {
                j++;
            }
            next[i] = j;
        }
        // 如果是由重复子串构成, next[n-1]即模式串的
        // 真前缀和真后缀相等的最大长度 不为0, 且s的长度是next[n-1]的整数倍
        if (next[n - 1] > 0 && s.size() % next[n - 1] == 0) {
            return true;
        } else {
            return false;
        }
    }
};
```
