+++
date = '2025-05-31T10:11:32+08:00'
draft = false
title = '代码随想录_day14'
image = "img/code.jpg"
license = false
math = true
categories = [
  "代码随想录",
  "c++"
]
+++
代码仓库: <https://github.com/Sophomoresty/Algorithm_Exercises.git>

## 6_对称二叉树_leetcode_101

**问题：** 判断一棵二叉树是否是镜像对称的。

### 1. 初始思路与分析

* **思路：** 使用层次遍历（BFS），将**每一层的所有节点值**都保存到一个 `vector<vector<int>>` 中。然后，遍历这个二维 `vector`，对每一层的 `vector<int>` 进行**双指针检查**，判断是否回文（对称）。
* **`isSymmetric` 函数中的问题点：**
  * **`nullptr` 信息丢失：** `temp` 向量只存储了非空节点的值。当一个节点是 `nullptr` 但其兄弟节点非 `nullptr` 时，这种不对称信息会丢失，导致错误判断（例如 `[null, 3]` 会被当成 `[3]` 对称）。
  * **双指针循环条件错误：** `for(left=0,right=temp.size()-1 ; left < temp.size(); ...)` 应该修正为 `left < right`。
  * **根节点为空处理：** `if (root == nullptr) { return false; }` 应为 `return true;` (空树对称)。

### 2. 优化的 BFS 策略：“同时入队对称节点”

针对 `nullptr` 信息丢失和提高效率的问题，我们探讨并实现了一种更优、更高级的 BFS 策略：

* **核心思想：** **同时入队两个应该镜像对称的节点**，并在循环中成对地比较它们。
* **实现步骤：**
    1. **根节点剪枝：** `if (root == nullptr) { return true; }`
    2. **初始入队：** 将 `root->left` 和 `root->right` 作为第一对镜像节点入队。
    3. **循环：** `while (!que.empty())`。
    4. **取出节点对：** 每次从队列中取出两个节点 `node1` 和 `node2`。
    5. **核心对称性判断逻辑（精髓）：**
        * **情况 A：** `if (node1 == nullptr && node2 == nullptr)`：两个都为空，是对称的，`continue` 检查下一对。
        * **情况 B：** `else if (node1 == nullptr || node2 == nullptr)`：一个为空，另一个不为空，**不对称，`return false`**。
        * **情况 C：** `else if (node1->val != node2->val)`：两个都不为空，但值不相等，**不对称，`return false`**。
        * **情况 D：** `else` (两个都不为空且值相等)：将它们的**镜像孩子对**入队，准备下一轮检查。
            * `que.push(node1->left); que.push(node2->right);`
            * `que.push(node1->right); que.push(node2->left);`
    6. **最终返回：** 如果循环结束未发现不对称，`return true;`。

### 3. 算法评估 (优化后的 BFS)

* **时间复杂度：** $O(N)$。每个节点都被访问一次，比较一次，入队出队一次。
* **空间复杂度：** $O(W)$。队列中存储的节点数取决于树的最大宽度。
* **结论：** 这种“同时入队对称节点”的 BFS 策略是解决对称二叉树问题的**最优解法**。它比分层存储再判断更高效、更简洁，并正确处理了 `nullptr` 节点的对称性。

### 总结体会

**对称二叉树：** 层次遍历通过**巧妙地组织入队元素（成对入队镜像节点）**，直接在遍历过程中验证对称性，将问题转换为一系列的“镜像对”检查。

```cpp

#include <limits>
#include <queue>
#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *result;
    TreeNode() : val(0), left(nullptr), result(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), result(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right)
        : val(x), left(left), result(right) {}
};

class Solution {
public:
    bool isSymmetric_v2(TreeNode *root) {
        if (root == nullptr) {
            return true;
        }
        queue<TreeNode *> que;

        // 加入对称节点

        que.push(root->left);
        que.push(root->result);
        while (!que.empty()) {
            TreeNode *left = que.front();
            que.pop();
            TreeNode *right = que.front();
            que.pop();
            // 1.左右为空, 跳过
            // 2.左右其中一个为空, return
            // 3.左右均不为空, 左右的值相等
            // 4.左右均不为空, 左右的值不相等
            if (left == nullptr && right == nullptr) {
                continue;
            } else if (left == nullptr || right == nullptr) {
                return false;
            } else if (left->val != right->val) {
                return false;
            } else {
                que.push(left->left);
                que.push(right->result);
                que.push(left->result);
                que.push(right->left);
            }
        }
        return true;
    }

    bool isSymmetric_v1(TreeNode *root) {
        // 本题root非空
        queue<TreeNode *> que;
        que.push(root);
        while (!que.empty()) {
            int size = que.size();
            vector<int> temp;
            // temp用于保存每一层的值
            for (int i = 0; i < size; i++) {
                TreeNode *cur = que.front();
                que.pop();
                if (cur == nullptr) {
                    // 如果cur为空
                    // 加入一个int中的最小值
                    temp.push_back(numeric_limits<int>::min());
                } else {
                    temp.push_back(cur->val);
                    que.push(cur->left);
                    que.push(cur->result);
                }
            }

            int left = 0;
            int right = temp.size() - 1;

            for (; left < right; left++, right--) {
                if (temp[left] != temp[right]) {
                    return false;
                }
            }
        }
        return true;
    }
};
``cpp

## 6_翻转二叉树_leetcode_226

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
    void swap_child(TreeNode *node) {
        TreeNode *temp = node->left;
        node->left = node->right;
        node->right = temp;
    }

    TreeNode *invertTree(TreeNode *root) {
        // 思路很简单, 层序遍历, 对每一层的节点, 调换左右孩子
        // 剪枝
        if (root == nullptr) {
            return root;
        }

        queue<TreeNode *> que;
        que.push(root);

        while (!que.empty()) {
            int size = que.size();
            TreeNode *cur;
            for (int i = 0; i < size; i++) {
                cur = que.front();
                que.pop();
                // 调换左右孩子, 左右孩子一定存在, 要么为空, 要么为TreeNode*
                swap_child(cur);

                if (cur->left != nullptr) {
                    que.push(cur->left);
                }
                if (cur->right != nullptr) {
                    que.push(cur->right);
                }
            }
        }
        return root;
    }
};
```

## 8_对称二叉树_leetcode_101

**问题：** 判断一棵二叉树是否是镜像对称的。

### 1. 初始思路与分析

* **思路：** 使用层次遍历（BFS），将**每一层的所有节点值**都保存到一个 `vector<vector<int>>` 中。然后，遍历这个二维 `vector`，对每一层的 `vector<int>` 进行**双指针检查**，判断是否回文（对称）。
* **`isSymmetric` 函数中的问题点：**
  * **`nullptr` 信息丢失：** `temp` 向量只存储了非空节点的值。当一个节点是 `nullptr` 但其兄弟节点非 `nullptr` 时，这种不对称信息会丢失，导致错误判断（例如 `[null, 3]` 会被当成 `[3]` 对称）。
  * **双指针循环条件错误：** `for(left=0,right=temp.size()-1 ; left < temp.size(); ...)` 应该修正为 `left < right`。
  * **根节点为空处理：** `if (root == nullptr) { return false; }` 应为 `return true;` (空树对称)。

### 2. 优化的 BFS 策略：“同时入队对称节点”

针对 `nullptr` 信息丢失和提高效率的问题，我们探讨并实现了一种更优、更高级的 BFS 策略：

* **核心思想：** **同时入队两个应该镜像对称的节点**，并在循环中成对地比较它们。
* **实现步骤：**
    1. **根节点剪枝：** `if (root == nullptr) { return true; }`
    2. **初始入队：** 将 `root->left` 和 `root->right` 作为第一对镜像节点入队。
    3. **循环：** `while (!que.empty())`。
    4. **取出节点对：** 每次从队列中取出两个节点 `node1` 和 `node2`。
    5. **核心对称性判断逻辑（精髓）：**
        * **情况 A：** `if (node1 == nullptr && node2 == nullptr)`：两个都为空，是对称的，`continue` 检查下一对。
        * **情况 B：** `else if (node1 == nullptr || node2 == nullptr)`：一个为空，另一个不为空，**不对称，`return false`**。
        * **情况 C：** `else if (node1->val != node2->val)`：两个都不为空，但值不相等，**不对称，`return false`**。
        * **情况 D：** `else` (两个都不为空且值相等)：将它们的**镜像孩子对**入队，准备下一轮检查。
            * `que.push(node1->left); que.push(node2->right);`
            * `que.push(node1->right); que.push(node2->left);`
    6. **最终返回：** 如果循环结束未发现不对称，`return true;`。

### 3. 算法评估 (优化后的 BFS)

* **时间复杂度：** $O(N)$。每个节点都被访问一次，比较一次，入队出队一次。
* **空间复杂度：** $O(W)$。队列中存储的节点数取决于树的最大宽度。
* **结论：** 这种“同时入队对称节点”的 BFS 策略是解决对称二叉树问题的**最优解法**。它比分层存储再判断更高效、更简洁，并正确处理了 `nullptr` 节点的对称性。

### 总结体会

**对称二叉树：** 层次遍历通过**巧妙地组织入队元素（成对入队镜像节点）**，直接在遍历过程中验证对称性，将问题转换为一系列的“镜像对”检查。

```cpp
#include <limits>
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
public:
    bool isSymmetric_v2(TreeNode *root) {
        if (root == nullptr) {
            return true;
        }
        queue<TreeNode *> que;

        // 加入对称节点

        que.push(root->left);
        que.push(root->right);
        while (!que.empty()) {
            TreeNode *left = que.front();
            que.pop();
            TreeNode *right = que.front();
            que.pop();
            // 1.左右为空, 跳过
            // 2.左右其中一个为空, return
            // 3.左右均不为空, 左右的值相等
            // 4.左右均不为空, 左右的值不相等
            if (left == nullptr && right == nullptr) {
                continue;
            } else if (left == nullptr || right == nullptr) {
                return false;
            } else if (left->val != right->val) {
                return false;
            } else {
                que.push(left->left);
                que.push(right->right);
                que.push(left->right);
                que.push(right->left);
            }
        }
        return true;
    }

    bool isSymmetric_v1(TreeNode *root) {
        // 本题root非空
        queue<TreeNode *> que;
        que.push(root);
        while (!que.empty()) {
            int size = que.size();
            vector<int> temp;
            // temp用于保存每一层的值
            for (int i = 0; i < size; i++) {
                TreeNode *cur = que.front();
                que.pop();
                if (cur == nullptr) {
                    // 如果cur为空
                    // 加入一个int中的最小值
                    temp.push_back(numeric_limits<int>::min());
                } else {
                    temp.push_back(cur->val);
                    que.push(cur->left);
                    que.push(cur->right);
                }
            }

            int left = 0;
            int right = temp.size() - 1;

            for (; left < right; left++, right--) {
                if (temp[left] != temp[right]) {
                    return false;
                }
            }
        }
        return true;
    }
};

```

## 9_二叉树的最大深度_leetcode_111

```cpp
#include <algorithm>
using namespace std;

// 用递归法完成
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    int max_depth_overall; // 全局变量, 表示最大深度
    // 前序: 根左右,是自顶向下的

    void get_max_height_preorder(TreeNode *root, int cur_path_depth) {
        // 1.终止条件
        if (root == nullptr) {
            return;
        }
        // 2.递归
        // 根
        max_depth_overall = max(max_depth_overall, cur_path_depth);

        // 遍历左子树, 更新最大深度
        get_max_height_preorder(root->left, cur_path_depth + 1);
        // 遍历右子树, 更新最大深度
        get_max_height_preorder(root->right, cur_path_depth + 1);
    }

    int maxDepth_preorder(TreeNode *root) {
        max_depth_overall = 0;
        if (root == nullptr) {
            return 0;
        }
        get_max_height_preorder(root, 1);
        return max_depth_overall;
    }

    int maxDepth_postorder(TreeNode *root) {
        if (root == nullptr) {
            return 0;
        }

        int left_height = maxDepth_postorder(root->left);
        int right_height = maxDepth_postorder(root->right);

        return max(left_height, right_height) + 1;
    }
};
```

## 10_二叉树的最小深度_leetcode_104

```cpp
#include <algorithm>
#include <limits>

using namespace std;
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    // 采用前序遍历
    int min_depth_overall; //全局变量, 存储最小的深度
    // min_depth_path 表示当前路径下的最小深度
    void min_depth(TreeNode *node, int current_depth_path) {
        // 1.终止条件 处理空节点
        if (node == nullptr) {
            return;
        }

        // 2.终止条件 处理叶子节点, 更新最小深度
        if (node->left == nullptr && node->right == nullptr) {
            min_depth_overall = min_depth_overall < current_depth_path
                                    ? min_depth_overall
                                    : current_depth_path;
            // 找到叶子节点, 当前路径的深度已确定, 不需要向下
            return;
        }
        // 3.递归到左右子树
        min_depth(node->left, current_depth_path + 1);
        min_depth(node->right, current_depth_path + 1);
    }

    int minDepth_preorder(TreeNode *root) {
        if (root == nullptr) {
            return 0;
        }
        // 初始化为最大值
        min_depth_overall = numeric_limits<int>::max();
        min_depth(root, 1);
        return min_depth_overall;
    }

    // 采用后序遍历
    int minDepth_postorder(TreeNode *root) {
        // 1.递归终止条件 处理空节点
        if (root == nullptr) {
            return 0;
        }

        // 2.递归获取左右子树的最小深度
        int left_min_depth = minDepth_postorder(root->left);
        int right_min_depth = minDepth_postorder(root->right);

        // 3.处理当前节点
        if (root->left == nullptr) {
            return right_min_depth + 1;
        }
        if (root->right == nullptr) {
            return left_min_depth + 1;
        }
        return min(left_min_depth, right_min_depth) + 1;
    }
};
```
