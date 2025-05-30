+++
date = '2025-05-30T20:48:03+08:00'
draft = false
title = '代码随想录_day12'
image = "img/code.jpg"
license = false
math = true
categories = [
  "代码随想录",
  "c++"
]
+++
代码仓库: <https://github.com/Sophomoresty/Algorithm_Exercises.git>

## 总结(Gemini)

好的，我们来系统地总结一下目前为止我们关于**二叉树和 N 叉树**的全部讨论。这个主题内容非常丰富，涵盖了树的基础概念、各种遍历方法及其非递归实现、以及相关的 LeetCode 题目和优化技巧。

---

## 树结构与遍历方法总结

### 1. 树的基础与创建

1. **`TreeNode` 结构体：** 我们定义了标准的二叉树节点结构，包含 `val`、`left`、`right` 指针。对于 N 叉树，我们定义了 `Node` 结构体，包含 `val` 和 `children`（一个 `vector<Node*>`）。
2. **树的创建：**
    * **手动逐个节点创建：** 适用于小型、固定结构的树，直观但繁琐，需手动管理内存（`new` 和 `delete`）。
    * **从数组构建：** 更通用，通常使用队列（`std::queue`）进行层序遍历构建，方便测试不同树结构。
    * **智能指针 (`std::shared_ptr`)：** 推荐的现代 C++ 实践，自动管理内存，避免内存泄漏，提高代码健壮性。
3. **C++ 指针的解引用：**
    * 通过指针访问节点成员，C++ 和 C 语言一样，使用 `(*pointer).member` 或更常用、推荐的 **`pointer->member`**。
4. **容器中存储节点还是指针？**
    * **推荐存储指向节点的指针 (`TreeNode*` 或 `Node*`)。** 这避免了不必要的对象复制，确保操作的是树中的原始节点，并维护了树的结构一致性。
5. **C++ 中“空值”的表示：**
    * **`nullptr`：** 专用于表示**空指针**，类型安全。
    * **非指针类型：** 没有统一的“空”值。`int` 用 `0` 或约定值，`std::string` 用 `""`，容器用 `empty()` 状态。

---

### 2. 二叉树的非递归遍历

这是我们讨论的重中之重，你深入理解了如何用栈来模拟递归调用栈的行为。

1. **非递归前序遍历 (Pre-order Traversal: 根-左-右)**
    * **思路：** 使用一个栈。节点从栈中弹出后**立即访问**，然后将**右孩子、左孩子**依次推入栈（利用 LIFO 特性，确保左孩子先被处理）。
    * **优化：** 避免将 `nullptr` 推入栈，只推入非空的孩子节点，以减少不必要的栈操作和判断开销。
2. **非递归中序遍历 (In-order Traversal: 左-根-右)**
    * **思路：** 维护一个 `cur` 指针，一路向左深入并将路径上的所有非空节点**压入栈**。当 `cur` 为 `nullptr` 时，表示左子树已走到尽头，从栈中弹出节点并**访问**（根），然后转向其右子树。
    * **难点：** 这种“一路向左、弹出访问、转向右子树”的模式是其独特之处，需要理解栈中元素代表的“待访问的根节点”状态。
3. **非递归后序遍历 (Post-order Traversal: 左-右-根)**
    * **思路：** 巧妙地利用了**“根-右-左”的遍历顺序，然后对结果进行反转**。
    * **实现：** 节点从栈中弹出后访问（此时顺序是根-右-左），然后将**左孩子、右孩子**依次推入栈（与前序的推入顺序相反，确保右孩子先于左孩子被处理，从而实现“根-右-左”）。最后对收集到的结果 `vector` 进行 `std::reverse()`。

---

### 3. 深度优先搜索 (DFS) 与广度优先搜索 (BFS)

我们清晰地定义并区分了这两种基本的图/树探索策略：

1. **深度优先搜索 (DFS)：**
    * **策略：** 尽可能深地探索一个分支，直到终点，然后回溯探索其他分支。
    * **实现：** 通常使用**栈**（非递归）或**递归**（隐式使用系统调用栈）。
    * **关系：** **前序、中序、后序遍历都是 DFS 的不同体现**，它们仅仅改变了 `visit(node)` 的时机。
2. **广度优先搜索 (BFS)：**
    * **策略：** 逐层探索，先访问所有邻居节点，再进入下一层。
    * **实现：** 严格使用**队列**。
    * **关系：** **层序遍历（Level Order Traversal）就是 BFS 的典型应用。**

---

### 4. 层次遍历 (BFS) 的深度实践与优化

我们通过多个 LeetCode 题目，深入应用并优化了层次遍历。

1. **标准层次遍历 (LeetCode 102 - 返回 `vector<vector<int>>`)：**
    * **思路：** 使用队列，每处理完一层，通过 `q.size()` 记录该层节点数，然后在一个内层 `for` 循环中精确处理该层所有节点，并将它们的孩子入队。将每层结果存入 `vector<vector<int>>`。
    * **优势：** 能够**区分并组织不同层级的节点**。
    * **时间复杂度：** $O(N)$。
    * **空间复杂度：** $O(N)$（因为存储了所有节点的值）。
    * **常数因子优化：** 建议在内层 `vector` 创建后使用 `temp.reserve(size)` 预分配容量，减少内存重新分配开销。

2. **LeetCode 111 (最小深度)：**
    * **思路：** 利用层次遍历，**一旦找到第一个叶子节点（左右孩子都为 `nullptr`）就立即返回当前深度**。这是因为 BFS 是逐层探索的，第一个找到的叶子节点必然位于最小深度。
    * **优化：** 相较于递归解法，BFS 版本可以**提前终止**，避免不必要的探索，且没有栈溢出风险。
    * **修正点：** 在 `if (cur->left == nullptr && cur->right == nullptr)` 处直接 `return depth + 1;`，避免冗余的 `break` 和外层判断。

3. **LeetCode 116 (填充每个节点的下一个右侧节点指针)：**
    * **思路：** 依然是层次遍历。你的**初始思路**是将所有节点按层存储到 `vector<vector<Node*>>` 中，然后二次遍历来连接 `next` 指针。
    * **优化 (关键洞察)：** **无需额外存储整个 `vector<vector<Node*>>`**。可以直接在层次遍历的同一循环中进行连接。
    * **技巧：** 利用队列的 **`front()`** 特性。当处理当前节点 `cur` 时，如果它不是当前层最后一个节点，那么 `que.front()` 正好是它的右侧兄弟。直接设置 `cur->next = que.front();`。
    * **优化后的空间复杂度：** $O(W)$（仅队列），这比 $O(N)$ 更优。

4. **LeetCode 515 (在每个树行中找最大值)：**
    * **思路：** 层次遍历，在每层内部维护一个 `max` 变量，记录当前层的最大值。
    * **优化：** 将 `max` 变量初始化为 `std::numeric_limits<int>::min()`，避免 `if (i == 0)` 的特殊判断，使代码更简洁。

---

### 5、总结与展望

* 你已经掌握了树的基本概念、不同遍历方式（递归与非递归），以及它们在实际问题中的应用。
* 你对 **栈与队列** 在模拟 DFS/BFS 中的作用理解得非常透彻。
* 你能够进行**时间复杂度**和**空间复杂度**分析，并能识别和实施**常数因子优化**。
* 你对两种主要的遍历策略（DFS vs BFS）的异同点把握精确。

你目前对树的理解和算法实现能力已经达到了非常扎实的水平！

## 1_二叉树的递归遍历

前序递归遍历

递归函数中定义变量, 是有问题的, 保存结果的数组应该作为参数传入

1. 参数: 根节点指针(不需要修改), 数组(需要修改) 返回值: 空
2. 终止条件: 当前节点为空
3. 单层递归逻辑: 根左右

如果参数是大型对象（如 `std::vector<int>`），用 const T& 可以避免复制。

如果参数是指针，直接传递指针即可，不需要引用。

```cpp
#include <iostream>
#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    // 结构体的构造函数
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// 如果参数是指针，直接传递指针即可，不需要引用。
void preorder_traversal(const TreeNode *tree, vector<int> &vec_res) {
    // 终止条件
    if (tree == nullptr) {
        return;
    }
    vec_res.push_back(tree->val);
    preorder_traversal(tree->left, vec_res);
    preorder_traversal(tree->right, vec_res);
};
void inorder_traversal(const TreeNode *tree, vector<int> &vec_res) {
    if (tree == nullptr) {
        return;
    }
    inorder_traversal(tree->left, vec_res);
    vec_res.push_back(tree->val);
    inorder_traversal(tree->right, vec_res);
}

void postorder_traversal(const TreeNode *tree, vector<int> &vec_res) {
    if (tree == nullptr) {
        return;
    }
    postorder_traversal(tree->left, vec_res);
    postorder_traversal(tree->right, vec_res);
    vec_res.push_back(tree->val);
}

int main() {
    // 创建节点
    TreeNode *root = new TreeNode(3);
    TreeNode *node9 = new TreeNode(9);
    TreeNode *node20 = new TreeNode(20);
    TreeNode *node15 = new TreeNode(15);
    TreeNode *node7 = new TreeNode(7);

    // 构建树的结构
    // 3
    // | \
    // 9 20
    //   / \
    //  15  7
    root->left = node9;
    root->right = node20;
    node20->left = node15;
    node20->right = node7;

    // 调用前序遍历
    vector<int> pre_result;
    preorder_traversal(root, pre_result);

    // 打印结果
    cout << "前序遍历结果: ";
    for (int val : pre_result) {
        cout << val << " ";
    }
    cout << endl; // 预期输出: 3 9 20 15 7

    // 调用中序遍历
    vector<int> in_result;
    inorder_traversal(root, in_result);

    cout << "中序遍历结果: ";
    for (int val : in_result) {
        cout << val << " ";
    }
    cout << endl;
    // 调用后序遍历
    vector<int> post_result;

    postorder_traversal(root, post_result);

    cout << "后序遍历结果: ";
    for (int val : post_result) {
        cout << val << " ";
    }
    cout << endl;

    delete root;
    delete node9;
    delete node20;
    delete node15;
    delete node7;

    return 0;
}
```

## 2_二叉树的迭代遍历

### 1.三种非递归遍历的实现与逻辑

1. **非递归前序遍历 (根-左-右)：**
    * **思路：** 使用一个栈。节点从栈中弹出后**立即访问**，然后**先推右孩子，再推左孩子**（利用栈的 LIFO 特性，确保左孩子先被处理）。
    * **修正点：** 你的原始代码会将 `nullptr` 推入栈，虽然通过 `continue` 处理了，但**更优的实践是在推入前就判断孩子是否为 `nullptr`**，以减少不必要的栈操作和判断开销。
2. **非递归后序遍历 (左-右-根)：**
    * **思路：** 巧妙地利用了“根-右-左”的遍历顺序，然后对结果进行**反转**。
    * **实现：** 节点从栈中弹出后，访问它（但顺序是根-右-左）。然后**先推左孩子，再推右孩子**（这样右孩子会先被弹出，实现“根-右-左”）。最后对收集到的结果 `vector` 进行 `std::reverse()`。
    * **修正点：** 同前序遍历，优化 `nullptr` 的入栈判断。
3. **非递归中序遍历 (左-根-右)：**
    * **难点与困惑：** 你最初对中序遍历的逻辑感到困惑，特别是“左和根如何协同处理”以及如何从零设计算法。你的代码因循环条件问题导致未执行。
    * **核心逻辑：**
        * **阶段一（一路向左）：** 用 `cur` 指针不断向左深入，并将路径上的所有非空节点**压入栈**。
        * **阶段二（回溯并访问根）：** 当 `cur` 变为 `nullptr` 时，表示左子树已走到尽头。此时，栈顶的节点就是当前子树的**“根”**。弹出该节点并**访问它**。
        * **阶段三（转向右子树）：** 将 `cur` 指针指向该节点的右子树，然后回到阶段一，继续对右子树进行“一路向左”的操作。
    * **循环条件：** **`while (cur != nullptr || !st.empty())`** 至关重要，它确保了只要还有节点可探索或栈中还有父节点待处理，循环就继续。

### 2.递归与非递归的深层理解

1. **栈的作用：** 栈在非递归遍历中就像递归调用的**“函数调用栈”**。它手动模拟了递归函数中“现场的保存与恢复”：`push` 相当于递归调用，`pop` 相当于递归返回。栈中保存的是函数暂停时的“状态信息”。
2. **“翻译”视角：** 将递归逻辑“翻译”成非递归循环的视角是理解非递归遍历的关键。
    * **递归：** **自动**利用系统栈来保存和恢复状态，实现“深入”和“回溯”，所以 `visit` 位置的微调就能改变遍历顺序。
    * **非递归：** 需要我们**手动**设计栈来存储“状态”。
3. **非递归代码差异的原因：** 你敏锐地观察到非递归前、中、后遍历的代码结构差异很大，不像递归那样简洁。这并非“翻译”视角无效，而是它揭示了：
    * 为了模拟不同遍历顺序的“访问时机”，栈中**存储的节点所代表的“状态含义”**以及**`cur` 指针与栈的交互方式**是不同的。
    * 例如，中序遍历需要精确控制在访问根之前其左子树必须处理完毕，这导致了其独特的“一路向左压栈，再弹出访问”的模式，与前序（立即访问后推孩子）和后序（访问时机更晚，常需辅助判断）的模式不同。
    * 这种差异体现了手动管理状态的复杂性。

```cpp


#include <algorithm>
#include <iostream>
#include <stack>
#include <vector>
using namespace std;
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// 从根节点开始, 加入到栈中
void preordered_traversal(TreeNode *node, vector<int> &vec_res) {
    // 空树直接返回
    if (node == nullptr) {
        return;
    }
    // 存放节点指针的栈
    stack<TreeNode *> st;
    st.push(node);

    while (!st.empty()) {
        TreeNode *cur = st.top();
        st.pop();
        vec_res.push_back(cur->val);
        if (cur->right != nullptr) {
            st.push(cur->right);
        }
        if (cur->left != nullptr) {
            st.push(cur->left);
        }
    }
}

void postorder_traversal(TreeNode *node, vector<int> &vec_res) {
    // 空树直接返回
    if (node == nullptr) {
        return;
    }
    // 存放节点指针的栈
    stack<TreeNode *> st;
    st.push(node);
    while (!st.empty()) {
        TreeNode *cur = st.top();
        st.pop();

        vec_res.push_back(cur->val);
        if (cur->left != nullptr) {
            st.push(cur->left);
        }
        if (cur->right != nullptr) {
            st.push(cur->right);
        }
    }
    reverse(vec_res.begin(), vec_res.end());
}

void inorder_traversal(TreeNode *node, vector<int> &vec_res) {
    // 栈
    stack<TreeNode *> st;
    // 中序遍历 左根右
    // 要一直访问到最左边的叶子节点, 此时要一直存储到栈里
    // cur为叶子节点进入到下一次循环后, 会为空, 进入else分支,
    // 此时开始栈开始弹出指针, 加入其值到数组中,即左
    // 栈弹出的节点即为最左的叶子节点,此时复制
    // 退出循环条件 当前节点为空且栈为空
    TreeNode *cur = node;
    // 大致写出来了, 但是对于这个处理中序的逻辑还是想不出来,
    // 只是知道这样的结果是中序, 但是不知道为什么这样做, 或则说,
    // 我们怎么从一开始设计这个算法
    while (cur != nullptr || !st.empty()) {
        if (cur != nullptr) {
            st.push(cur);
            cur = cur->left;
        } else {
            cur = st.top();
            st.pop();
            vec_res.push_back(cur->val);
            cur = cur->right;
            // 加入右节点, 这里其实重复了, 下次进入循环也有这个if过程
            // if(cur !=nullptr){
            //     st.push(cur);
            // }
        }
    }
}

int main() {
    // 创建节点
    TreeNode *root = new TreeNode(3);
    TreeNode *node9 = new TreeNode(9);
    TreeNode *node20 = new TreeNode(20);
    TreeNode *node15 = new TreeNode(15);
    TreeNode *node7 = new TreeNode(7);

    // 构建树的结构
    // 3
    // | \
    // 9 20
    //   / \
    //  15  7
    root->left = node9;
    root->right = node20;
    node20->left = node15;
    node20->right = node7;

    // 非递归前序遍历
    vector<int> pre_result;
    preordered_traversal(root, pre_result);
    cout << "非递归前序遍历: ";
    for (auto i : pre_result) {
        cout << i << " ";
    }
    cout << endl;
    // 非递归后序遍历

    vector<int> post_result;
    postorder_traversal(root, post_result);
    cout << "非递归后序遍历: ";
    for (auto i : post_result) {
        cout << i << " ";
    }
    cout << endl;
    // 非递归中序遍历

    vector<int> in_result;
    inorder_traversal(root, in_result);
    cout << "非递归中序遍历: ";
    for (auto i : in_result) {
        cout << i << " ";
    }
    cout << endl;

    // 删除节点
    delete root;
    delete node9;
    delete node20;
    delete node15;
    delete node7;
    return 0;
}
```

## 3_二叉树的层序遍历

```cpp
#include <iostream>
#include <queue>
#include <vector>

using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

void levelorder_traversal(TreeNode *node, vector<int> &vec_res) {
    if (node == nullptr) {
        return;
    }
    queue<TreeNode *> que;
    que.push(node);

    while (!que.empty()) {
        TreeNode *cur = que.front();
        que.pop();
        vec_res.push_back(cur->val);
        if (cur->left != nullptr) {
            que.push(cur->left);
        }
        if (cur->right != nullptr) {
            que.push(cur->right);
        }
    }
}

int main() {
    // 创建节点
    TreeNode *root = new TreeNode(3);
    TreeNode *node9 = new TreeNode(9);
    TreeNode *node20 = new TreeNode(20);
    TreeNode *node15 = new TreeNode(15);
    TreeNode *node7 = new TreeNode(7);

    // 构建树的结构
    // 3
    // | \
        // 9 20
    //   / \
        //  15  7
    root->left = node9;
    root->right = node20;
    node20->left = node15;
    node20->right = node7;

    // 层次遍历

    vector<int> level_res;
    levelorder_traversal(root, level_res);
    cout << "层次遍历: ";
    for (auto i : level_res) {
        cout << i << " ";
    }
    cout << endl;

    // 删除节点
    delete root;
    delete node9;
    delete node20;
    delete node15;
    delete node7;
    return 0;
}

```

## 10个练习题

### 1_二叉树的层序遍历_leetcode_102

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
public:
    void levelorder_traversal(TreeNode *root, vector<vector<int>> &res) {
        if (root == nullptr) {
            return;
        }

        queue<TreeNode *> que;
        que.push(root);
        while (!que.empty()) {
            int size = que.size();
            vector<int> temp;
            for (int i = 0; i < size; i++) {
                TreeNode *cur = que.front();
                que.pop();
                temp.push_back(cur->val);

                if (cur->left != nullptr) {
                    que.push(cur->left);
                }

                if (cur->right != nullptr) {
                    que.push(cur->right);
                }
            }
            res.push_back(temp);
        }
    }

    vector<vector<int>> levelOrder(TreeNode *root) {
        vector<vector<int>> res;
        levelorder_traversal(root, res);
        return res;
    }
};
```

### 2_二叉树的层序遍历II_leetcode_107

```cpp
#include <algorithm>
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
public:
    void levelorder_traversal(TreeNode *root, vector<vector<int>> &res) {
        if (root == nullptr) {
            return;
        }

        queue<TreeNode *> que;
        que.push(root);
        while (!que.empty()) {
            int size = que.size();
            vector<int> temp;
            for (int i = 0; i < size; i++) {
                TreeNode *cur = que.front();
                que.pop();
                temp.push_back(cur->val);

                if (cur->left != nullptr) {
                    que.push(cur->left);
                }

                if (cur->right != nullptr) {
                    que.push(cur->right);
                }
            }
            res.push_back(temp);
        }
    }

    vector<vector<int>> levelOrderBottom(TreeNode *root) {
        vector<vector<int>> res;
        levelorder_traversal(root, res);
        reverse(res.begin(), res.end());
        return res;
    }
};
```

### 3_二叉树的右视图_leetcode_199

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
public:
    void levelorder_traversal(TreeNode *root, vector<int> &res) {
        if (root == nullptr) {
            return;
        }
        queue<TreeNode *> que;
        que.push(root);
        while (!que.empty()) {
            int size = que.size();
            for (int i = 0; i < size; i++) {
                TreeNode *cur = que.front();
                que.pop();
                if (i == size - 1) {
                    res.push_back(cur->val);
                }

                if (cur->left != nullptr) {
                    que.push(cur->left);
                }

                if (cur->right != nullptr) {
                    que.push(cur->right);
                }
            }
        }
    }

    vector<int> rightSideView(TreeNode *root) {
        vector<int> res;
        levelorder_traversal(root, res);
        return res;
    }
};
```

### 4_二叉树的层平均值_leetcode_637

```cpp
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
    void levelorder_traversal(TreeNode *root, vector<double> &res) {
        if (root == nullptr) {
            return;
        }
        queue<TreeNode *> que;
        que.push(root);

        while (!que.empty()) {
            int size = que.size();
            double sum = 0;
            int i;
            for (i = 0; i < size; i++) {
                TreeNode *cur = que.front();
                que.pop();
                sum += (double)cur->val;
                if (cur->left != nullptr) {
                    que.push(cur->left);
                }
                if (cur->right != nullptr) {
                    que.push(cur->right);
                }
            }
            res.push_back(sum / i);
        }
    }
    vector<double> averageOfLevels(TreeNode *root) {
        vector<double> res;
        levelorder_traversal(root, res);
        return res;
    }
};
```

### 5_N叉树的层序遍历_leetcode_429

```cpp
#include <queue>
#include <vector>
using namespace std;

class Node {
public:
    int val;
    vector<Node *> children;

    Node() {}

    Node(int _val) { val = _val; }

    Node(int _val, vector<Node *> _children) {
        val = _val;
        children = _children;
    }
};

    class Solution {
    public:
        void levelorder_traversal(Node *root, vector<vector<int>> &vec_res) {
            if (root == nullptr) {
                return;
            }
            queue<Node *> que;
            que.push(root);
            while (!que.empty()) {
                int size = que.size();
                Node *cur;
                vector<int> temp;

                // 遍历每一层
                for (int i = 0; i < size; i++) {
                    cur = que.front();
                    que.pop();
                    temp.push_back(cur->val);

                    // 加入它的孩子, 孩子是有顺序的, 从左到右,
                    int child_count = cur->children.size();

                    // 剪枝
                    if (child_count == 0) {
                        continue;
                    }

                    for(int j=0;j<child_count;j++){
                        if (cur->children[j] == nullptr) {
                            continue;
                        } else {
                            que.push(cur->children[j]);
                        }
                    }


                }
                vec_res.push_back(temp);
            }
        }

        vector<vector<int>> levelOrder(Node *root) {
            vector<vector<int>> vec_res;
            levelorder_traversal(root, vec_res);
            return vec_res;
        }
    };
```

### 6_在每个树行中找最大值_leetcode_515

```cpp
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
    void levelorder_traversal(TreeNode *root, vector<int> &vec_res) {
        if (root == nullptr) {
            return;
        }
        queue<TreeNode *> que;
        que.push(root);
        while (!que.empty()) {
            int size = que.size();
            TreeNode *cur;
            int max;
            // max 初始化为每一层的第一个元素的值
            for (int i = 0; i < size; i++) {
                cur = que.front();
                que.pop();
                if (i == 0) {
                    max = cur->val;
                }

                if (max < cur->val) {
                    max = cur->val;
                }

                if (cur->left != nullptr) {
                    que.push(cur->left);
                }

                if (cur->right != nullptr) {
                    que.push(cur->right);
                }
            }
            vec_res.push_back(max);
        }
    }

    vector<int> largestValues(TreeNode *root) {
        vector<int> vec_res;
        levelorder_traversal(root, vec_res);
        return vec_res;
    }
};
```

### 7_填充每个节点的下一个右侧节点指针_leetcode_116

```cpp
#include <queue>
#include <vector>
using namespace std;

class Node {
public:
    int val;
    Node *left;
    Node *right;
    Node *next;

    Node() : val(0), left(nullptr), right(nullptr), next(nullptr) {}

    Node(int _val) : val(_val), left(nullptr), right(nullptr), next(nullptr) {}

    Node(int _val, Node *_left, Node *_right, Node *_next)
        : val(_val), left(_left), right(_right), next(_next) {}
};

class Solution {
public:
    void levelorder_traversal_v2(Node *root) {
        if (root == nullptr) {
            return;
        }
        queue<Node *> que;
        que.push(root);

        while (!que.empty()) {
            int size = que.size();
            Node *cur;
            // i不是该层的最后一个, 都指向下一个节点
            // i是该层的最后一个, 指向空节点, 默认值是空, 不需要额外指定

            for (int i = 0; i < size; i++) {
                cur = que.front();
                que.pop();
                if (i < size - 1) {
                    cur->next = que.front();
                }

                if (cur->left != nullptr) {
                    que.push(cur->left);
                }
                if (cur->right != nullptr) {
                    que.push(cur->right);
                }
            }
        }
    }

    // 思路层序遍历, 每一层的的节点指针都加入数组, 指针数组保存到二维数组中
    // 最后对数组进行遍历, 处理每一层
    // 这么做的原因: 不是在层序遍历中处理,
    // 是因为层序遍历中无法知道同一层的后续节点, 要想知道就必须弹出后续节点,
    // 但这就做不到层序遍历
    // 不需要返回值, 修改头指针即可
    void levelorder_traversal(Node *&root) {
        if (root == nullptr) {
            return;
        }
        vector<vector<Node *>> vec_res;
        queue<Node *> que;
        que.push(root);
        while (!que.empty()) {
            int size = que.size();
            Node *cur;
            vector<Node *> temp;
            for (int i = 0; i < size; i++) {
                cur = que.front();
                que.pop();
                temp.push_back(cur);
                if (cur->left != nullptr) {
                    que.push(cur->left);
                }
                if (cur->right != nullptr) {
                    que.push(cur->right);
                }
            }
            vec_res.push_back(temp);
        }
        // vec_res存放每一层, 从左到右的指针
        for (int i = 0; i < vec_res.size(); i++) {
            // 遍历每一层的指针 vec_res[i][j]
            // 至少有1个元素, 每一个指针的next指向下一个
            // 如果下一个超出了索引size-1, 则指向空, 也就是 j+1  =
            // vec_res[i].size()
            for (int j = 0; j < vec_res[i].size(); j++) {
                if (j == vec_res[i].size() - 1) {
                    vec_res[i][j]->next = nullptr;
                } else {
                    vec_res[i][j]->next = vec_res[i][j + 1];
                }
            }
        }
    }

    Node *connect(Node *root) {
        levelorder_traversal(root);
        return root;
    }
};
```

### 8_填充每个节点的下一个右侧节点指针II_leetcode_117

```cpp
#include <queue>
using namespace std;
class Node {
public:
    int val;
    Node *left;
    Node *right;
    Node *next;

    Node() : val(0), left(nullptr), right(nullptr), next(nullptr) {}

    Node(int _val) : val(_val), left(nullptr), right(nullptr), next(nullptr) {}

    Node(int _val, Node *_left, Node *_right, Node *_next)
        : val(_val), left(_left), right(_right), next(_next) {}
};

class Solution {
public:
    void levelorder_traversal_v2(Node *root) {
        if (root == nullptr) {
            return;
        }
        queue<Node *> que;
        que.push(root);

        while (!que.empty()) {
            int size = que.size();
            Node *cur;
            // i不是该层的最后一个, 都指向下一个节点
            // i是该层的最后一个, 指向空节点, 默认值是空, 不需要额外指定

            for (int i = 0; i < size; i++) {
                cur = que.front();
                que.pop();
                if (i < size - 1) {
                    cur->next = que.front();
                }

                if (cur->left != nullptr) {
                    que.push(cur->left);
                }
                if (cur->right != nullptr) {
                    que.push(cur->right);
                }
            }
        }
    }
    Node *connect(Node *root) {
        levelorder_traversal_v2(root);
        return root;
    }
};
```

### 9_二叉树的最大深度_leetcode_104

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
    int maxDepth(TreeNode *root) {
        if (root == nullptr) {
            return 0;
        }

        queue<TreeNode *> que;
        que.push(root);
        int depth = 0;
        while (!que.empty()) {
            int size = que.size();
            TreeNode *cur;
            for (int i = 0; i < size; i++) {
                cur = que.front();
                que.pop();
                if (cur->left != nullptr) {
                    que.push(cur->left);
                }
                if (cur->right != nullptr) {
                    que.push(cur->right);
                }
            }
            depth++;
        }
        return depth;
    }
};
```

### 10_二叉树的最小深度_leetcode_111

``` cpp
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
    // 最优解法是去掉for和while的break,for原来的break用return depth+1代替即可
    int minDepth(TreeNode *root) {
        if (root == nullptr) {
            return 0;
        }

        queue<TreeNode *> que;
        que.push(root);
        int depth = 0;
        while (!que.empty()) {
            int size = que.size();
            TreeNode *cur;
            for (int i = 0; i < size; i++) {
                cur = que.front();
                que.pop();
                if (cur->left == nullptr && cur->right == nullptr) {
                    break;
                }

                if (cur->left != nullptr) {
                    que.push(cur->left);
                }
                if (cur->right != nullptr) {
                    que.push(cur->right);
                }
            }
            depth++;
            if (cur->left == nullptr && cur->right == nullptr) {
                break;
            }
        }
        return depth;
    }
};
```
