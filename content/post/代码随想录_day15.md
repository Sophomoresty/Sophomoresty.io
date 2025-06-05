+++
date = '2025-06-05T14:24:02+08:00'
draft = false
title = '代码随想录_day15'
image = "img/code.jpg"
license = false
math = true
categories = [
  "代码随想录",
  "c++"
]
+++
代码仓库: <https://github.com/Sophomoresty/Algorithm_Exercises.git>

## 11_完全二叉树的节点个数_leetcode_222

```cpp
#include <queue>
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
    int countNodes(TreeNode *root) {
        if (root == nullptr) {
            return 0;
        }
        queue<TreeNode *> que;
        que.push(root);
        int node_count = 0;
        while (!que.empty()) {
            int size = que.size();
            for (int i = 0; i < size; i++) {
                TreeNode *cur = que.front();
                que.pop();
                node_count++;
                if (cur->left != nullptr) {
                    que.push(cur->left);
                }
                if (cur->right != nullptr) {
                    que.push(cur->right);
                }
            }
        }
        return node_count;
    }
};
```

## 12_平衡二叉树_leetcode_110

```cpp
#include <algorithm>
#include <cstdlib>
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
    int get_height_postorder(TreeNode *root) {
        if (root == nullptr) {
            return 0;
        }
        int left_height = get_height_postorder(root->left);
        if (left_height == -1) {
            return -1;
        }
        int right_height = get_height_postorder(root->right);
        if (right_height == -1) {
            return -1;
        }

        if (abs(left_height - right_height) > 1) {
            return -1;
        }
        return max(left_height, right_height) + 1;
    }

    bool isBalanced(TreeNode *root) { return get_height_postorder(root) != -1; }
};

```

## 13_二叉树的所有路径_leetcode_257

### 核心任务与方法

本题的核心任务是找出二叉树中所有从根节点到叶子节点的路径，并将它们以字符串的形式（例如 `1->2->5`）存储起来。我们采用的是 **深度优先搜索 (DFS)** 的思想，具体来说是**前序递归**。

### 递归设计的三要素回顾

在解决这个问题时，我们再次运用了递归的“三要素”原则，并对其中的关键点进行了完善：

1. **函数作用与参数 (`traversal(TreeNode* node, std::vector<int>& current_path_vals)`)**
    * **函数作用：** 这个辅助函数的目标是，在当前 `node` 及其子树中，找到所有能到达叶子节点的路径，并将它们加入到全局的结果集 `res` 中。
    * **参数 `node`：** 当前正在访问的树节点。
    * **参数 `current_path_vals`：** 这是一个关键的 **引用传递 (`&`)** 参数，它用于在不同递归层级间**共享和累积**从根节点到当前 `node` 的路径上的所有节点值。正是因为它是引用，我们才能在递归调用中修改同一个 `vector` 实例，避免了昂贵的**按值复制**开销。

2. **终止条件 (Base Cases)**
    * **空节点：** `if (node == nullptr) { return; }`。这是最基本的递归出口，当路径走到尽头（空指针）时，停止探索。
    * **叶子节点：** `if (node->left == nullptr && node->right == nullptr)`。这是找到一条完整路径的标志。当抵达叶子节点时，`current_path_vals` 中存储的就是从根到当前叶子的完整路径。此时，我们将其转化为字符串，并添加到最终结果集 `res` 中。

3. **递归关系 (Recursive Step) 与回溯**
    本题最核心的模式是 **“添加 - 递归 - 回溯”**，它完美地体现了前序遍历和状态管理：

    * **添加 (Pre-order / “根”操作)：** `current_path_vals.push_back(node->val);`
        * 在每次进入一个新节点 `node` 的递归函数时，我们都将其值加入到 `current_path_vals` 中。这代表了我们“向前”走了一步，将当前节点纳入路径。

    * **递归 (DFS / “左”、“右”操作)：**
        `traversal(node->left, current_path_vals);`
        `traversal(node->right, current_path_vals);`
        * 在将当前节点加入路径后，我们递归地调用自身去探索其左子树和右子树，**信任**这些子调用会完成各自的任务。

    * **回溯 (Post-order / “清理”操作)：** `current_path_vals.pop_back();`
        * 这是**最关键**的一步，它确保了共享状态 `current_path_vals` 的正确性。当一个节点 `node` 的所有子树（左子树和右子树）都探索完毕后，`node` 在**当前路径**上的职责就完成了。
        * 为了让**父节点**能够探索**其他分支**（例如，从 `node` 的父节点转向 `node` 的兄弟节点），我们需要将 `node` 从 `current_path_vals` 中移除，使 `current_path_vals` 恢复到 `node` **被加入之前的状态**。这就是“回溯”，它像橡皮擦一样擦去当前节点对路径的临时修改。

### 易错点与优化

* **`path` 参数传递方式：** 最初我们遇到的问题是 `vector<int> path` 按值传递，导致每次递归都复制整个 `vector`，且无法正确积累路径。修正为**引用传递 (`vector<int>& path`)** 是解决此问题的关键。
* **回溯 `pop_back()` 的位置：** 必须确保每次 `push_back()` 都有一个对应的 `pop_back()`，并且 `pop_back()` 发生在所有子递归调用完成之后。即，在函数**即将返回之前**。

```cpp
#include <string>
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
    vector<string> res;
    // 1.参数root, path数组, 修改全局变量res
    void travesal(TreeNode *node, vector<int> &path) {
        // 2.终止条件1: 遇到空结点

        if (node == nullptr) {
            return;
        }
        // 中
        path.push_back(node->val);

        // 3.终止条件2: 遇到叶子节点,开始将path数组转化为字符串, 加入到res中
        if (node->left == nullptr && node->right == nullptr) {
            string result;
            for (int i = 0; i < path.size(); i++) {
                result += to_string(path[i]);
                if (i < path.size() - 1) {
                    result += "->";
                }
            }
            res.push_back(result);
        }
        // 左
        travesal(node->left, path);
        // 右
        travesal(node->right, path);
        path.pop_back();
    }

    vector<string> binaryTreePaths(TreeNode *root) {
        vector<int> path;
        travesal(root, path);
        return res;
    }
};
```

## 15_左叶子之和_leetcode_15

### 方案一：前序递归（自顶向下），传递“我是左孩子吗？”的状态

这种方案需要一个辅助函数和一个全局变量，类似于我们之前求深度的方式。

* **`sumOfLeftLeaves(TreeNode* root)` 函数的作用：** 遍历树，累加所有左叶子的值到全局变量 `total_sum`。
* **辅助函数 `dfs(TreeNode* node, bool is_left_child)`：**
  * `node`：当前节点。
  * `is_left_child`：布尔值，表示 `node` 是不是其父节点的左孩子。这个信息由父节点传递下来。
* **累加时机：** 当 `node` 是一个叶子节点，并且 `is_left_child` 为 `true` 时，才将 `node->val` 加到 `total_sum`。

```cpp
#include <iostream> // For testing
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int total_sum_of_left_leaves; // 全局变量，累加所有左叶子之和

    /**
     * @brief 辅助函数：使用前序递归遍历树，并根据节点是否是左孩子进行累加。
     *
     * @param node 当前访问的节点。
     * @param is_left_child 布尔值，指示当前 node 是否为其父节点的左孩子。
     */
    void dfs_preorder(TreeNode* node, bool is_left_child) {
        // 1. 终止条件 (Base Case):
        // 如果当前节点是 nullptr，直接返回。
        if (node == nullptr) {
            return;
        }

        // 2. "访问"当前节点 (前序处理):
        // 如果当前节点是叶子节点，并且它是一个左孩子，则将其值加入总和。
        if (node->left == nullptr && node->right == nullptr && is_left_child) {
            total_sum_of_left_leaves += node->val;
        }

        // 3. 递归到左右子树:
        // 向左子树递归时，传递 true (表示左孩子)。
        dfs_preorder(node->left, true);
        // 向右子树递归时，传递 false (表示右孩子)。
        dfs_preorder(node->right, false);
    }

    /**
     * @brief 计算所有左叶子之和的主函数。
     *
     * @param root 二叉树的根节点。
     * @return int 所有左叶子之和。
     */
    int sumOfLeftLeaves(TreeNode* root) {
        total_sum_of_left_leaves = 0; // 每次调用清零

        // 处理空树的情况
        if (root == nullptr) {
            return 0;
        }

        // 从根节点开始 DFS。根节点本身不是任何人的“左孩子”，所以传入 false。
        dfs_preorder(root, false);

        return total_sum_of_left_leaves;
    }
};
```

### 方案二：后序递归（自底向上），在父节点进行判断和累加（更巧妙）

这种方案利用后序递归的返回值。函数返回的是**其子树中左叶子的和**。

* **`sumOfLeftLeaves(TreeNode* root)` 函数的作用：** 返回以 `root` 为根的子树中**所有左叶子的和**。
* **累加时机：** 当一个节点 `root` 接收到其左孩子 `root->left` 的返回值后，它自己判断 `root->left` 是否是左叶子。
  * 如果 `root->left` 存在，且 `root->left` 是一个叶子节点，那么 `root->left->val` 就是一个左叶子，需要加到总和里。
  * 然后，加上 `root->left` 为根的子树中**其余**左叶子的和（递归调用 `sumOfLeftLeaves(root->left)` 的返回值），以及 `root->right` 为根的子树中所有左叶子的和。

```cpp
#include <iostream> // For testing
// TreeNode 定义 (假设已存在)
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    /**
     * @brief 使用后序递归计算所有左叶子之和。
     * 函数返回以 root 为根的子树中所有左叶子的和。
     *
     * @param root 当前子树的根节点。
     * @return int 当前子树中所有左叶子之和。
     */
    int sumOfLeftLeaves(TreeNode* root) {
        // 1. 终止条件 (Base Case):
        // 如果当前节点是 nullptr，它没有左叶子，返回 0。
        if (root == nullptr) {
            return 0;
        }

        // 2. 递归获取左右子树中左叶子之和 (后序遍历，左右):
        // sumOfLeftLeaves(root->left) 将返回以 root->left 为根的子树中所有左叶子的和。
        int left_sum = sumOfLeftLeaves(root->left);
        // sumOfLeftLeaves(root->right) 将返回以 root->right 为根的子树中所有左叶子的和。
        int right_sum = sumOfLeftLeaves(root->right);

        // 3. 处理当前节点 (后序遍历，根):
        // 关键点：在这里判断 root 的左孩子是否是一个左叶子。
        int current_node_contribution = 0;
        // 如果 root 有左孩子，并且这个左孩子是一个叶子节点，
        // 那么这个左孩子就是一个“左叶子”，它自己的值需要被加上。
        if (root->left != nullptr && root->left->left == nullptr && root->left->right == nullptr) {
            current_node_contribution = root->left->val;
        }

        // 4. 返回总和：
        // 当前子树所有左叶子之和 = 左子树中左叶子之和 + 右子树中左叶子之和 + 当前节点左孩子作为左叶子的贡献。
        return left_sum + right_sum + current_node_contribution;
    }
};
```

### 总结

我们之前的困惑在于，如何将“我是左孩子”这个信息传递给递归，并正确累加。

* **方案一（前序）：** 通过在函数参数中传递 `is_left_child` 布尔值，自顶向下地告诉每个节点它的身份。在叶子节点处进行判断和累加。
* **方案二（后序）：** 更巧妙。每个父节点自行判断其左孩子是否是左叶子，然后将这个值加上其左右子树递归返回的和。这样，`sumOfLeftLeaves(node)` 返回的就是 `node` 子树中所有左叶子的总  和。这种方法更符合你所说的“我相信它会返回正确结果”的后序递归模式。

两种方案都能正确解决问题。方案二（后序递归）通常被认为是更简洁和优雅的解决方案，因为它避免了全局变量。
