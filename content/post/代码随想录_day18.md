+++
date = '2025-06-05T14:38:36+08:00'
draft = false
title = '代码随想录_day18'
image = "img/code.jpg"
license = false
math = true
categories = [
  "代码随想录",
  "c++"
]
+++
代码仓库: <https://github.com/Sophomoresty/Algorithm_Exercises.git>

## 24_二叉搜索树的最小绝对差_leetcode_530

本题要求找出二叉搜索树 (BST) 中任意两个节点值之间的**最小绝对差**。

### 1. 问题核心：BST 的有序性

解决这道题的关键在于利用 **BST 的核心特性**：

* BST 的**中序遍历**结果是一个**严格递增**的有序序列。
* 在有序序列中，最小的差值必然发生在**相邻元素**之间。

因此，我们的任务就变成了：对 BST 进行中序遍历，并在遍历过程中比较相邻节点的值，找出最小差值。

### 2. 解法：递归中序遍历 + 辅助变量

最经典且高效的方法是采用**递归中序遍历**。为了在递归调用中“记住”前一个访问的节点，我们需要一个辅助变量。

#### 核心思路

执行标准的**中序遍历**（左子树 -> 根节点 -> 右子树）。当访问到每个节点（“根”部分）时，将其值与**前一个**已经访问过的节点的值进行比较，并更新最小差值。

#### 实现细节与重要考点

1. **辅助变量**：
    * 使用类成员变量 `TreeNode* pre` 来存储中序遍历中当前节点的**前一个节点**的指针。
    * 使用类成员变量 `int res_min` 来存储迄今为止找到的**最小绝对差**，并初始化为 `INT_MAX`。
2. **函数设计**：
    * 通常会有一个 `void` 类型的辅助递归函数（例如 `getMinimumDifference_help`），它负责执行中序遍历并更新 `pre` 和 `res_min` 这两个成员变量。
    * 公共接口函数 `getMinimumDifference(TreeNode* root)` 则负责初始化 `pre` 和 `res_min`，调用辅助函数，并最终返回 `res_min`。
3. **重置关键**：
    * **最重要的一点**：由于 `pre` 和 `res_min` 是类成员变量，它们会**保留上一个测试用例的状态**。因此，在公共接口函数 `getMinimumDifference` 的开头，**必须显式地将 `pre` 重置为 `nullptr`，将 `res_min` 重置为 `INT_MAX`**。这是确保每次函数调用独立且结果正确的核心。
4. **计算与更新**：
    * 在 `getMinimumDifference_help` 函数中，当中序遍历访问到当前节点 `root` 时：
        * 首先**递归处理左子树**。
        * 然后，检查 `pre` 是否为 `nullptr`。如果 `pre` 不为空（说明 `root` 不是中序遍历的第一个节点），就计算 `std::abs(pre->val - root->val)`。
        * 使用 `std::min(res_min, current_diff)` 或一个 `if` 语句来**更新 `res_min`**。
        * 最后，将 `pre` 更新为当前节点 `root`，为处理下一个节点做准备。
        * 接着**递归处理右子树**。

#### 最终代码逻辑

```cpp
#include <algorithm> // For std::min
#include <climits>   // For INT_MAX
#include <cmath>     // For std::abs

// TreeNode 结构体定义 (此处省略，假设已提供)

class Solution {
private:
    int res_min_member;   // 类成员变量，用于保存最小绝对差
    TreeNode *pre_member; // 类成员变量，用于保存中序遍历的前一个节点

    // 辅助递归函数：执行中序遍历并计算最小绝对差
    void getMinimumDifference_help(TreeNode *root) {
        if (root == nullptr) {
            return; // 终止条件：空节点，停止递归
        }

        // 1. 递归左子树 (中序遍历的 "左" 部分)
        getMinimumDifference_help(root->left);

        // 2. 处理当前节点 (中序遍历的 "根" 部分)
        if (pre_member != nullptr) { // 只有当 pre_member 不为空时，才能计算差值
            int current_diff = std::abs(pre_member->val - root->val);
            res_min_member = std::min(res_min_member, current_diff); // 更新最小差值
        }
        pre_member = root; // 更新前一个节点为当前节点

        // 3. 递归右子树 (中序遍历的 "右" 部分)
        getMinimumDifference_help(root->right);
    }

public:
    // 主入口函数
    int getMinimumDifference(TreeNode *root) {
        // 每次调用公共接口时，重置成员变量，确保计算独立性
        res_min_member = INT_MAX; 
        pre_member = nullptr;     

        getMinimumDifference_help(root); // 调用辅助递归函数
        
        return res_min_member; // 返回最终结果
    }
};
```

### 4. 复杂度

* **时间复杂度**：$O(N)$。每个节点被访问一次。
* **空间复杂度**：$O(H)$，其中 $H$ 是树的高度。主要来自递归栈的深度。最坏情况下 (倾斜树) $O(N)$。

## 25_二叉搜索树中的众数_leetcode_501

### 1. 问题描述与挑战

本题要求找出二叉搜索树 (BST) 中出现频率最高的元素（即**众数**）。BST 中的元素值可能存在重复。

**挑战**：如何高效地统计频率，并找出众数，同时尽量优化空间复杂度。

### 2. 问题核心：BST 中序遍历的有序性

解决这道题的关键在于利用 **BST 的中序遍历特性**：

* BST 的中序遍历结果是一个**有序序列**。
* 在有序序列中，**相同的元素值必然是连续出现的**。

这个特性使得我们无需使用额外的哈希表（`unordered_map`）来统计所有频率，从而实现 $O(1)$ 的额外空间复杂度（不计算递归栈空间和结果存储空间）。

### 3. 解法：一次中序遍历 + 精妙的状态管理 (最优解)

这是本题最推荐且最具挑战性的解法，它在一次中序遍历中完成频率统计和众数收集。

#### 核心思路

执行标准的**中序遍历**（左子树 -> 根节点 -> 右子树）。在遍历过程中，维护三个状态变量：

1. `pre`：指向中序遍历中当前节点**前一个**访问过的节点。
2. `count`：记录当前节点值**连续出现**的次数。
3. `max_count`：记录迄今为止遇到的**最大频率**。

#### 实现细节与重要考点

1. **状态变量**：
    * `TreeNode *pre;`：保存前一个访问的节点，用于比较当前节点值。
    * `int count;`：记录当前数字的连续出现次数。
    * `int max_count;`：记录历史最高频率。
    * `std::vector<int> res_vec;`：存储最终的众数结果（因为可能不止一个众数）。

2. **函数设计**：
    * `void inorder_traversal(TreeNode *root)`：一个 `void` 类型的辅助递归函数，负责执行中序遍历并动态更新上述状态变量。
    * `std::vector<int> findMode(TreeNode *root)`：公共接口函数，负责初始化所有成员变量，调用辅助函数，并最终返回 `res_vec`。

3. **状态更新逻辑 (中序遍历核心)**：
    * 当遍历到当前节点 `root` 时：
        * **更新 `count`**：
            * 如果 `pre` 为空（即 `root` 是中序遍历的第一个节点），`count = 1`。
            * 如果 `root->val == pre->val`，`count++`。
            * 如果 `root->val != pre->val`，`count = 1`（重置计数）。
        * **更新 `max_count` 和 `res_vec`**：
            * 如果 `count == max_count`：说明当前值也是众数，将其加入 `res_vec`。
            * 如果 `count > max_count`：发现新的最高频率，更新 `max_count`，**清空 `res_vec`**，然后将当前值加入 `res_vec`。
            * 如果 `count < max_count`：不做任何操作。
        * **更新 `pre`**：`pre = root;` 为下一次比较做准备。

4. **成员变量重置**：
    * **最重要的一点**：由于 `pre`、`count`、`max_count` 和 `res_vec` 是类成员变量，它们会保留上一个测试用例的状态。因此，在公共接口函数 `findMode` 的开头，**必须显式地重置它们**（`pre = nullptr; count = 0; max_count = 0; res_vec.clear();`），以确保每次函数调用独立且结果正确。

#### 最终代码逻辑

```cpp
# include <climits> // 包含 INT_MIN (用于 max_count 的初始化)
# include <vector>
using namespace std;
// TreeNode 结构体定义 (通常 LeetCode 环境会提供)
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode*right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode*right)
        : val(x), left(left), right(right) {}
};

class Solution {
private:
    TreeNode *pre; // 指向前一个遍历到的节点 (中序遍历顺序)
    int count;     // 当前节点值连续出现的次数
    int max_count; // 遍历过程中遇到的最大频率
    std::vector<int> res_vec; // 存储最终的众数 (可能不止一个)

public:
    // 辅助函数：执行中序遍历并动态更新频率和众数
    // 返回值：void (通过成员变量修改外部状态)
    void inorder_traversal(TreeNode *root) {
        // 1. 终止条件 / 基本情况
        if (root == nullptr) {
            return;
        }

        // 2. 递归左子树 (中序遍历的 "左" 部分)
        inorder_traversal(root->left);

        // 3. 处理当前节点 (中序遍历的 "根" 部分) - 核心逻辑
        // 步骤 A: 更新当前节点值的连续出现次数 (count)
        if (pre == nullptr) { // 如果 pre 为空，说明当前是中序遍历的第一个节点
            count = 1;
        } else if (pre->val == root->val) { // 如果当前节点值与前一个节点值相同
            count++;                        // 连续计数递增
        } else {       // 如果当前节点值与前一个节点值不同
            count = 1; // 重置连续计数为 1
        }
        pre = root; // 更新 pre 指针为当前节点 (为下一个节点的比较做准备)

        // 步骤 B: 根据 count 更新 max_count 和 res_vec (收集众数)
        if (count == max_count) {
            // 如果当前连续计数等于已知的最大频率，说明找到了一个等频率的众数
            res_vec.push_back(root->val);
        } else if (count > max_count) {
            // 如果当前连续计数大于已知的最大频率，说明找到了新的最大频率
            max_count = count; // 更新最大频率
            res_vec.clear(); // 清空之前存储的众数 (因为它们频率不够了)
            res_vec.push_back(root->val); // 将当前节点值作为新的众数加入
        }
        // else if (count < max_count): 这种情况不需要任何操作，因为当前频率不够高

        // 4. 递归右子树 (中序遍历的 "右" 部分)
        inorder_traversal(root->right);
    }

    // 主入口函数
    vector<int> findMode(TreeNode *root) {
        // **关键修正**：每次调用公共接口时，重置成员变量，
        // 避免多个测试用例之间互相影响，确保每次计算都是独立的。
        pre = nullptr; // 重置 pre 指针
        count =
            0; // 重置连续计数 (实际在第一个节点会被设为1，这里设0或任意值都可以)
        max_count = 0; // 重置最大频率 (初始为0，确保任何正频率都能成为最大)
        res_vec.clear(); // 清空结果数组

        // 调用辅助递归函数开始遍历和计算
        inorder_traversal(root);

        // 返回最终收集到的众数列表
        return res_vec;
    }
};
```

### 5. 复杂度

* **时间复杂度**：$O(N)$。中序遍历会访问树中的每个节点一次。
* **空间复杂度**：$O(H)$ (递归栈的深度，最坏 $O(N)$) + $O(K)$ (结果数组 `res_vec`，K 为众数个数，最坏 $O(N)$)。**额外空间复杂度为 $O(1)$** (不计算递归栈和结果存储空间)。

## 26_二叉树的最近公共祖先_leetcode_236

### 1. 问题描述与挑战

给定一个二叉树的根节点 `root`，以及树中的两个不同节点 `p` 和 `q`，找出它们的**最近公共祖先 (LCA)**。最近公共祖先的定义是：“对于有根树 `T` 的两个节点 `p`、`q`，最近公共祖先 `LCA(T, p, q)` 是指一个最低的节点 `z`，使得 `z` 既是 `p` 的祖先，又是 `q` 的祖先（我们允许一个节点是它自己的祖先）。”

**挑战**：LCA 问题的递归模式与传统二叉树遍历（前、中、后、层序）或简单递归（如计算高度、路径和）不同，它需要**更复杂的自底向上信息汇报和分叉点识别**。

### 2. 递归设计方法论在 LCA 中的应用

LCA 问题是理解**递归函数“承诺”模型**和**自底向上信息回溯**的经典案例。

#### 2.1 核心思想：函数就是黑箱 — 相信与承诺

所有递归设计的起点。我们将 `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q)` 这个函数视为一个能完成特定任务的“黑箱”。

* **函数签名**：`TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q)`
* **函数承诺 (核心！)**：当这个函数被调用在**某个子树的根节点 `root` 上时，它承诺会返回：**
    1. 如果 `p` 和 `q` **都存在于** 以 `root` 为根的这棵子树中：
        * 返回它们的**最近公共祖先 (LCA) 节点**。
    2. 如果 `p` 和 `q` **只有一个存在于** 以 `root` 为根的这棵子树中：
        * 返回**那个存在的节点** (`p` 或 `q`)。
    3. 如果 `p` 和 `q` **都不存在于** 以 `root` 为根的这棵子树中：
        * 返回 `nullptr`。

#### 2.2 基本情况 (Base Case) — 递归的终点

* **`root == nullptr`**：空节点无法包含 `p` 或 `q`。
  * **返回**：`nullptr` (兑现承诺：什么都没找到)。
* **`root == p || root == q`**：当前节点就是 `p` 或 `q` 中的一个。
  * **返回**：`root` (兑现承诺：我找到了其中一个目标节点，就返回我。如果另一个目标节点在我的子树里，那我就是 LCA；否则，我就是那个唯一找到的节点)。

#### 2.3 递归关系 (Recursive Relation) — 分解与组合

这是“相信”的力量。假设子问题 (`root->left` 和 `root->right`) 的 `lowestCommonAncestor` 调用已经兑现了它们的“承诺”，返回了正确结果 (`left_res` 和 `right_res`)。现在，`root` 需要根据这些“汇报”，决定自己向上一层汇报什么。

* **场景 1：`left_res` 和 `right_res` 都非空** (`left_res != nullptr && right_res != nullptr`)
  * **含义**：左子树汇报找到了一个目标（或其 LCA），右子树也汇报找到了另一个目标（或其 LCA）。这说明 `p` 和 `q` 分别位于 `root` 的左右子树中。
  * **结论**：当前 `root` 就是 `p` 和 `q` 的 LCA。
  * **返回**：`root` (兑现承诺：返回 LCA)。

* **场景 2：`left_res` 为空，`right_res` 非空** (`left_res == nullptr && right_res != nullptr`)
  * **含义**：左子树什么都没找到，所有目标节点（`p` 和 `q`，或其中一个）都存在于 `root` 的右子树中。
  * **结论**：LCA 必然在右子树中，或者 `right_res` 本身就是 `p` 或 `q`。
  * **返回**：`right_res` (兑现承诺：返回那个存在的目标节点或子树中的 LCA)。

* **场景 3：`left_res` 非空，`right_res` 为空** (`left_res != nullptr && right_res == nullptr`)
  * **含义**：右子树什么都没找到，所有目标节点（`p` 和 `q`，或其中一个）都存在于 `root` 的左子树中。
  * **结论**：LCA 必然在左子树中，或者 `left_res` 本身就是 `p` 或 `q`。
  * **返回**：`left_res` (兑现承诺：返回那个存在的目标节点或子树中的 LCA)。

* **场景 4：`left_res` 和 `right_res` 都为空** (`left_res == nullptr && right_res == nullptr`)
  * **含义**：左右子树都什么都没找到。
  * **结论**：`p` 和 `q` 都不存在于以 `root` 为根的这棵子树中。
  * **返回**：`nullptr` (兑现承诺：什么都没找到)。

#### 2.4 信息流向：自底向上汇报结果

LCA 的递归本质是**自底向上**的信息传递。`p` 和 `q` 就像在树中发出信号的灯塔。这些信号沿着调用栈一层层向上回溯，直到：

* **信号汇聚点**：第一个同时收到来自左右子树信号的祖先节点，它就“捕获”了这两个信号，并识别出自己就是 LCA。
* **信号传递者**：如果一个节点只收到一个信号，它就继续把这个信号往上传。

### 3. 最终代码逻辑

```cpp
struct TreeNode {
    int val;
    TreeNode*left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    // 1.明确签名与承诺:
    // 参数是当前树的节点, p,q两个目标节点
    // 承诺, 我感觉要回答承诺, 在一开始我很难直接给出, 我需要写出整体的函数框架, 才能给出承诺
    // 这里的承诺不是单一的, 思考也不能从根节点出发, 首先我们是自底向上的, 所以要代入基础情况和中间节点思考, 最后再到根节点
    // 从基础情况来看, root是空节点直接返回空节点; root是p或则q, 返回root, 表明我们找到了p或则q
    // 后续就是遵循自底向上, 也就是后序遍历, 我们拿到左右子树返回的结果, 噢, 不对由于后续的内容我还没思考, 我也不知道它返回什么结果.
    // 所以承诺必须得一开始思考出来, 在这里写的时候把函数当成黑箱, 用承诺去理解.
    // 所以承诺是:
    // 1) 如果有p或则q, 我返回给你
    // 2) 如果有p和q的最近的公共祖先, 我返回给你
    // 3) 如果没有p和q, 我返回给你空
    // 2.基本情况
    // 1) root是空节点
    // 2) root是p或则q
    // 3.假设子问题已经解决, 我现在需要综合左右子树返回的信息, 继续向上传递
    // 如果左右均不为空, 意味着root是最近的公共祖先
    // 如果左右其中一个为空, 我继续向上传递不为空
    // 如果左右均为空, 我传递为空
    // 4.信息流向, 自下而上汇报结果
    // 5.剪枝/优化, 优化不了, 我需要逐一从下往上汇报给根节点, 不能提前停止

    TreeNode *lowestCommonAncestor(TreeNode *root, TreeNode *p, TreeNode *q) {
        // 2.基本情况
        if (root == nullptr) {
            return root;
        }
        if (root == p || root == q) {
            return root;
        }
        // 3.递归关系

        TreeNode *left_res = lowestCommonAncestor(root->left, p, q);
        TreeNode *right_res = lowestCommonAncestor(root->right, p, q);
        // 拿到左右子树的结果, root要根据现有的信息再向上汇报
        if (left_res != nullptr && right_res != nullptr) {
            return root;
        } else if (left_res != nullptr) {
            return left_res;
        } else {
            return right_res;
        }
    }
};
```

### 4. 复杂度分析

* **时间复杂度**：$O(N)$。在最坏情况下，需要遍历树中的所有节点。每个节点最多被访问一次。
* **空间复杂度**：$O(H)$，其中 $H$ 是树的高度。这主要来自递归栈的深度。在最坏情况下（树倾斜），$H$ 可以是 $N$，所以空间复杂度为 $O(N)$。
