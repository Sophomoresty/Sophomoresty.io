+++
date = '2025-06-05T14:31:14+08:00'
draft = false
title = '代码随想录_day17'
image = "img/code.jpg"
license = false
math = true
categories = [
  "代码随想录",
  "c++"
]
+++
代码仓库: <https://github.com/Sophomoresty/Algorithm_Exercises.git>

## 19_单调栈做法_最大二叉树_leetcode_654

```cpp
#include <stack>
#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right)
        : val(x), left(left), right(right) {}
};

class Solution {
public:
    TreeNode *constructMaximumBinaryTree(std::vector<int> &nums) {

        /*单调递减栈能做最大二叉树的原因:
        单调栈擅长解决“寻找左右第一个更大/更小元素”问题高度

        而对于本题数组中的任意元素 X (nums[i])：
        X 的左孩子：是 X 左边子数组中作为根的那个元素. 准确说, 是 X 左侧、且在 X 左边第一个比 X 大的元素的右侧范围内的最大值. 
        X 的右孩子：是 X 右边子数组中作为根的那个元素. 准确说, 是 X 右侧、且在 X 右边第一个比 X 大的元素的左侧范围内的最大值. 
        X 的父节点：是 X 左边第一个比它大的元素 和 X 右边第一个比它大的元素 中值较小的那一个. 如果它两边都没有比它大的, 那它就是整个树的根. 
        
        恰好符合单调栈的解决问题的特征
        */

        std::stack<TreeNode *> st; // 存储 TreeNode* 的单调递减栈

        // 遍历输入数组中的每个数字
        for (int i = 0; i < nums.size(); i++) {

            // 1. 为当前数字创建一个 TreeNode 节点
            TreeNode *cur = new TreeNode(nums[i]);

            // 2. “收编”阶段 (构建树的左子树) ：处理栈内比 cur 小的元素
            // 最后一次循环中的栈顶节点 p 满足: 
            // 是 cur 右侧, 且在 cur 左边第一个比 cur 大的元素的右侧范围内的最大值.
            // 总结: 循环中最后一次的栈顶节点 p 是 cur 的 左孩子
            while (!st.empty() && st.top()->val < cur->val) {
                TreeNode *p = st.top(); // 获取栈顶节点 p
                st.pop();               // 将 p 弹出栈
                cur->left = p;
            }

            // 3. “被收编”阶段 (构建树的右子树) ： 如果栈非空, 意味着栈内有元素, 且大于cur

            // 此时的栈顶节点 t 即是 cur左边第一个比它大的元素, cur也是t临近的右侧子数组中的根节点
            // 总结: 栈顶是cur的爸爸, cur是栈顶的右孩子

            if (!st.empty()) {
                TreeNode *t = st.top(); // 获取栈顶节点 t
                t->right = cur;         // 将 cur 设置为 t 的右孩子
            }

            // 4. 入栈
            st.push(cur);
        }

        // 5. 获取根节点

        // 树构建完毕, 栈非空, 栈底即是我们的根节点
        
        // 为什么非空? 为什么栈底是我们的根节点?
        // 我们维护的栈是单调递减栈, 维护体现在while循环中的pop中.
        // 根节点一旦入栈后, 将不会再遇到比它更大的元素（因为它已经是最大),
        // 因此它将永远不会被弹出, 并最终留在栈中, 沉到栈底.
        // 所以栈一定非空 且 栈底元素即为树的根节点.
        TreeNode *root = nullptr; // 初始化 root 为 nullptr
        if (!st.empty()) {
            root =
                st.top(); // 初始时 root 指向栈顶（可能是根, 也可能是根的右子孙）
            while (st.size() > 1) { // 循环弹出, 直到栈中只剩一个元素（根节点）
                st.pop();
                root = st.top(); // 更新 root 为新的栈顶（向栈底移动）
            }
        }
        return root; // 返回最终的根节点
    }
};

```

## 19_递归做法_最大二叉树_leetcode_654

```cpp
#include <iostream>
#include <queue>
#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right)
        : val(x), left(left), right(right) {}
};

class Solution {
private:
    // 采取左闭右开
    TreeNode *constructMaximumBinaryTree_help(const vector<int> &nums,
                                              int start, int end) {
        // 1.终止条件, 数组为空
        if (start >= end) {
            return nullptr;
        }

        // 2.寻找最大值及其索引, 这里时间复杂度有点高, 特别是递归多次的话, 能否优化
        int max = nums[start];
        int max_index = start;
        for (int i = start; i < end; i++) {
            if (nums[i] > max) {
                max = nums[i];
                max_index = i;
            }
        }

        // 3.创建节点
        TreeNode *node = new TreeNode(max);
        // 4.分割数组
        // 1) 左子树
        int start_left = start;
        int end_left = max_index;

        // 2) 右子树
        int start_right = max_index + 1;
        int end_right = end;

        // 5.递归处理
        node->left =
            constructMaximumBinaryTree_help(nums, start_left, end_left);
        node->right =
            constructMaximumBinaryTree_help(nums, start_right, end_right);
        return node;
    }

public:
    TreeNode *constructMaximumBinaryTree(vector<int> &nums) {
        return constructMaximumBinaryTree_help(nums, 0, nums.size());
    }
};
```

## 21_合并二叉树_leetcode_617


**问题描述**：给定两棵二叉树 `root1` 和 `root2`，将它们合并成一棵新二叉树。合并规则是：如果两个节点重叠，则将它们的值相加作为新节点的值；否则，不为空的节点将作为新树的节点。

### 我们遇到的问题与解决方案

1. **最初代码的编译错误**：
    * **我们的问题**：函数 `mergeTrees` 编译不通过，提示 `Non-void function does not return a value in all control paths` (非 `void` 函数并非在所有控制路径都返回值)。
    * **根本原因**：在 `root1` 和 `root2` 都不为 `nullptr` 的情况下，我们执行了 `root1->val += root2->val;` 和递归调用，但**缺少了最终的 `return root1;` 语句**。C++ 编译器要求所有非 `void` 函数在其所有可能的执行路径上都必须有 `return` 语句。
    * **解决方案**：在完成当前节点的合并和子树的递归连接后，明确 `return root1;`。

2. **对 `return` 语句位置的理解**：
    * **我们的疑问**：“`return` 好像一般放在终止条件那里”。
    * **解释与澄清**：
        * 对于**“自底向上”**的递归（例如计算树高、统计节点数），通常每个分支（包括基本情况和递归情况）都会返回一个值。
        * 对于**“自顶向下”**的递归（例如收集所有路径），如果函数返回 `void`，终止条件就是 `return;`。
        * **本题 (`mergeTrees`) 属于“自顶向下修改树结构”并同时“返回 `TreeNode*`”的混合模式**。因此，它在基本情况 (`root1 == nullptr` 或 `root2 == nullptr`) 处有 `return`，在处理完当前层逻辑并连接子树后，也需要 `return` 当前层修改后的根节点 (`root1`)。

### 最终代码逻辑（递归）

```cpp
class Solution {
public:
    TreeNode *mergeTrees(TreeNode *root1, TreeNode *root2) {
        // 1. 终止条件 / 基本情况
        if (root1 == nullptr) {
            return root2; // 如果 root1 为空，直接返回 root2（可能为null，也可能是子树）
        }
        if (root2 == nullptr) {
            return root1; // 如果 root2 为空，而 root1 不为空，返回 root1
        }

        // 2. 单层递归逻辑 / 处理当前节点
        // 如果 root1 和 root2 都不为空，则合并当前节点的值 (原地修改 root1)
        root1->val += root2->val;

        // 3. 递归合并子树
        // 相信递归会正确返回合并后的左/右子树根节点，并连接到 root1
        root1->left = mergeTrees(root1->left, root2->left);
        root1->right = mergeTrees(root1->right, root2->right);

        // 4. 返回当前合并后的树的根节点
        return root1; 
    }
};
```

## 22_二叉搜索树中的搜索_leetcode_700

**问题描述**：给定二叉搜索树（BST）的根节点和一个值 `val`，在 BST 中找到值为 `val` 的节点。如果节点存在，返回其子树；如果不存在，返回 `nullptr`。

### 我们遇到的问题与解决方案

**未充分利用 BST 特性**：
    * **我们的最初尝试**：我们最初的代码同时递归搜索了左右子树，像遍历普通二叉树一样。

        ```cpp
        // ...
        TreeNode *left = searchBST(root->left, val);
        TreeNode *right = searchBST(root->right, val);
        if (left == nullptr) return right;
        // ... (错误示范)
        ```

    * **根本原因**：没有利用 BST 的核心定义（左子树 < 根 < 右子树）。这种方法退化成了 $O(N)$ 的通用二叉树搜索，浪费了 BST 的 $O(\log N)$ 优势。
    * **解决方案**：在每个节点，根据 `root->val` 与 `val` 的比较结果，**只向一个方向（左或右）递归**。这实现了**剪枝**，显著提高效率。

```cpp

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right)
        : val(x), left(left), right(right) {}
};

class Solution {
public:
    // 1. 参数: 当前树的根节点, 参考值
    // 2. 返回值: 匹配到了的节点
    // 3. 终止条件:
    // 1) 空节点, 返回空节点
    // 2) 根节点匹配对应的值, 返回对应节点
    // 4.单层递归逻辑
    TreeNode *searchBST(TreeNode *root, int val) {
        // 3.终止条件
        if (root == nullptr || root->val == val) {
            return root;
        }

        if (val < root->val) {
            return searchBST(root->left, val);
        }
        if (val > root->val) {
            return searchBST(root->right, val);
        }
    }

    TreeNode *searchBST_traversal(TreeNode *root, int val) {
        // 迭代法遍历, 利用BST的特性
        while (root != nullptr) {
            if (val == root->val) {
                return root;
            } else if (val < root->val) {
                root = root->left;
            }
            // val > root->val
            else {
                root = root->right;
            }
        }
        return nullptr;
    }
};
```

## 23_验证二叉搜索树_leetcode_98

/*

### 1. 问题描述与核心定义

本题要求判断给定的二叉树是否是一个**有效的二叉搜索树 (Binary Search Tree, BST)**。

**BST 的核心定义（标准教科书版本，不允许重复值）：**

* 对于任意节点 `N`：
  * 其**左子树**中所有节点的值都**严格小于** `N->val`。
  * 其**右子树**中所有节点的值都**严格大于** `N->val`。
* 左右子树本身也必须是有效的 BST。

### 2. 核心思路：中序遍历的单调性

判断一个二叉树是否为 BST 的最经典、最直观且高效的方法是利用其**中序遍历**的特性：

* **一个有效的 BST 的中序遍历结果，必然是**严格递增**的（从小到大排序）。**
* 因此，我们可以对树进行中序遍历，并在遍历过程中，检查当前节点的值是否严格大于前一个节点的值。

### 3. 解法选择与实现方式

我们主要探讨了基于**递归中序遍历**的方法。

#### 递归中序遍历 + 辅助变量 (最优解)

**基本思路**：
执行中序遍历 (左 -> 根 -> 右)。在访问到每个节点（“根”部分）时，将其值与**前一个**已经访问过的节点的值进行比较。

**关键挑战与解决方案：**

1. **“前一个节点”状态的保存**：
    * **我们的洞察**：我们正确地意识到，`pre` (前一个节点) 的状态需要**跨越递归调用**进行保存，因此不能作为局部变量定义在函数体内。
    * **解决方案**：将 `pre` 定义为 `Solution` 类的**成员变量**（`TreeNode *pre = nullptr;`）。在每次 `isValidBST` 外部调用时（例如在 LeetCode 平台对每个测试用例调用时），需要确保 `pre` 被重置为 `nullptr`，以避免多个测试用例之间状态相互影响。

2. **严格递增的判断**：
    * **我们的质疑**：我们最初的判断条件可能只检查 `pre->val > root->val`，没有考虑到相等的情况。我们后续也精确地提出“BST 中 `pre` 和 `root` 的值不能相等”。
    * **解决方案**：确保判断条件捕获**所有违反严格递增的情况**。最严谨的条件是 `root->val <= pre->val`（如果 `pre` 不为 `nullptr`）。这会捕获 `pre` 大于 `root` 或 `pre` 等于 `root` 的所有不合法情况。

3. **递归剪枝与返回时机**：
    * **我们的问题**：我们最初的代码在左子树验证失败时，没有立即返回 `false`，而是继续了后续比较和右子树的递归。
    * **解决方案**：在每次递归调用子树（`isValidBST(root->left)` 或 `isValidBST(root->right)`）之后，如果子树的验证结果为 `false`，**立即返回 `false`**。这能有效剪枝，避免不必要的计算。

#### 最终代码逻辑 (递归中序遍历，符合标准 BST 定义)

```cpp
#include <stack>  // (通常用于迭代解法，这里用于确保包含，但不直接使用)
#include <vector> // (通常用于数组，这里用于确保包含，但不直接使用)

// TreeNode 结构体定义 (LeetCode 通常会提供)
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
private:
    // pre 指针用于保存中序遍历中当前节点的前一个节点。
    // 它是类成员变量，确保在递归调用之间保持状态。
    // 每次调用公共接口 isValidBST 时，需要确保其被重置。
    TreeNode *pre = nullptr; 

public:
    // 判断二叉树是否为有效的二叉搜索树 (BST)
    bool isValidBST(TreeNode *root) {
        // 1. 终止条件 / 基本情况 (Base Case)
        // 空节点被认为是有效的 BST 子树 (因为没有节点可以违反规则)
        if (root == nullptr) {
            return true;
        }

        // 2. 递归左子树 (中序遍历的 "左" 部分)
        // 如果左子树本身不是有效的 BST，那么整个树都不是，立即返回 false (剪枝，提高效率)
        if (!isValidBST(root->left)) {
            return false;
        }

        // 3. 处理当前节点 (中序遍历的 "根" 部分)
        // 检查当前节点的值是否严格大于前一个节点的值
        // 如果 pre 不为空 (即不是中序遍历的第一个节点)，
        // 并且当前节点的值不严格大于 pre 的值 (即 root->val <= pre->val)，
        // 则违反 BST 的严格递增性质（包括值相等的情况）。
        if (pre != nullptr && root->val <= pre->val) { 
            return false;
        }
        // 更新前一个节点为当前节点 (为下一个节点的比较做准备)
        pre = root;

        // 4. 递归右子树 (中序遍历的 "右" 部分)
        // 如果右子树本身不是有效的 BST，那么整个树都不是，立即返回 false (剪枝)
        if (!isValidBST(root->right)) {
            return false;
        }

        // 5. 如果左子树、当前节点检查、右子树都通过了验证，则整个子树是有效的 BST
        return true;
    }
};
```
