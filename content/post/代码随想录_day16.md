+++
date = '2025-06-05T14:28:34+08:00'
draft = false
title = '代码随想录_day16'
image = "img/code.jpg"
license = false
math = true
categories = [
  "代码随想录",
  "c++"
]
+++
代码仓库: <https://github.com/Sophomoresty/Algorithm_Exercises.git>

## 16_找树最左下角的值_leetcode_513

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

// 层序遍历
class Solution {
public:
    int levelorder_traversal(TreeNode *root) {
        // root非空
        queue<TreeNode *> que;
        que.push(root);

        while (!que.empty()) {
            int size = que.size();
            // 优化点：每次进入新的一层，当前层的第一个元素就是最左节点
            int res_val = que.front()->val; // 初始化
            for (int i = 0; i < size; i++) {
                TreeNode *cur = que.front();
                que.pop();
                if (cur->left != nullptr) {
                    que.push(cur->left);
                }
                if (cur->right != nullptr) {
                    que.push(cur->right);
                }
            }
        }
        // 返回最后一层的第1个元素
    }

    int findBottomLeftValue_none_recursion(TreeNode *root) {
        return levelorder_traversal(root);
    }
    // 树的最大深度
    int max_depth_all;
    // 最后的结果
    int bottom_left_value;
    void preorder_traversal(TreeNode *root, int cur_path_depth) {
        // 终止条件1: 空节点
        if (root == nullptr) {
            return;
        }
        // 终止条件2: 叶子节点
        if (root->left == nullptr && root->right == nullptr) {
            // 如果当前深度大于max_depeht_all的话, 就要更新值
            if (cur_path_depth > max_depth_all) {
                max_depth_all = cur_path_depth;
                bottom_left_value = root->val;
            }
        }
        preorder_traversal(root->left, cur_path_depth + 1);
        preorder_traversal(root->right, cur_path_depth + 1);
    }
    int findBottomLeftValue_recursion(TreeNode *root) {
        max_depth_all = 0;
        preorder_traversal(root, 1);
        return bottom_left_value;
    }
};
```

## 17_路径总和_leetcode_112

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
    bool hasPathSum(TreeNode *root, int targetSum) {
        // 终止条件1
        if (root == nullptr) {
            return false;
        }
        // 终止条件2
        if (root->left == nullptr && root->right == nullptr) {
            return root->val == targetSum;
        }

        return hasPathSum(root->left, targetSum - root->val) ||
               hasPathSum(root->right, targetSum - root->val);
    }
};
```

## 17_路径总和II_leetcode_113

```cpp
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
    void pre_traversal(TreeNode *root, vector<int> &path, int targetSum,
                       vector<vector<int>> &result_paths) {
        // 终止条件1
        if (root == nullptr) {
            return;
        }
        path.push_back(root->val);
        // 终止条件2
        if (root->left == nullptr && root->right == nullptr &&
            targetSum == root->val) {
            result_paths.push_back(path);
        }
        pre_traversal(root->left, path, targetSum - root->val, result_paths);
        pre_traversal(root->right, path, targetSum - root->val, result_paths);
        path.pop_back();
    }
    vector<vector<int>> pathSum(TreeNode *root, int targetSum) {
        vector<vector<int>> result_paths;
        if (root == nullptr) {
            return result_paths;
        }

        vector<int> current_path;
        pre_traversal(root, current_path, targetSum,result_paths);
        return result_paths;
    }
};
```

## 18_从前序与中序遍历序列构造二叉树_leetcode_105

```cpp
#include <iostream>
#include <unordered_map>
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

// 采用优化版本
// 哈希表存储inorder
// 不用剪切, 而采用序号表示分割后的数组
class Solution {
private:
    // 值: 索引
    unordered_map<int, int> inorder_map;

    // 返回值: 由前序和后序数组构建的树的根节点
    // 3.确定中序数组的分割点
    // 4.分割中序数组
    // 5.分割前序数组
    // 6.单层递归
    // 区间规则: 左闭右开
    TreeNode *buildTree_help(const vector<int> &preorder, int p_start,
                             int p_end, const vector<int> &inorder, int i_start,
                             int i_end) {
        // 1.终止条件
        if (!(p_start < p_end && i_start < i_end)) {
            return nullptr;
        }

        // 2.创建根节点
        int val = preorder[p_start];
        TreeNode *node = new TreeNode(val);

        // 3.获取中序数组的分割索引
        int i_index = inorder_map[val];

        // 4.分割中序数组 -> 左子树的中序数组 右子树的中序数组
        // 左中右

        // 1) 左子树
        int i_start_left = i_start;
        int i_end_left = i_index;

        // 2) 右子树
        int i_start_right = i_index + 1;
        int i_end_right = i_end;

        // 5.分割前序数组 -> 左子树的前序数组 右子树的前序数组
        // 中左右

        // 1) 左子树
        int p_start_left = p_start + 1;
        int p_end_left = p_start_left + i_end_left - i_start_left;

        // 2) 右子树
        int p_start_right = p_end_left;
        int p_end_right = p_end;

        // 6.单层递归逻辑
        node->left = buildTree_help(preorder, p_start_left, p_end_left, inorder,
                                    i_start_left, i_end_left);

        node->right = buildTree_help(preorder, p_start_right, p_end_right,
                                     inorder, i_start_right, i_end_right);

        return node;
    }

public:
    TreeNode *buildTree(vector<int> &preorder, vector<int> &inorder) {
        for (int i = 0; i < inorder.size(); i++) {
            inorder_map[inorder[i]] = i;
        }

        return buildTree_help(preorder, 0, preorder.size(), inorder, 0,
                              inorder.size());
    }
};

void print_by_preorder(TreeNode *root) {
    if (root == nullptr) {
        return;
    }
    cout << root->val << " ";
    print_by_preorder(root->left);
    print_by_preorder(root->right);
}

int main() {
    vector<int> preorder = {3, 9, 20, 15, 7};
    vector<int> inorder = {9, 3, 15, 20, 7};
    Solution sol;
    cout << "由前序和中序数组构建的树的前序遍历结果\n";
    print_by_preorder(sol.buildTree(preorder, inorder));
    cout << '\n';

    cout << "原前序数组\n";
    for (auto i : preorder) {
        cout << i << " ";
    }
    cout << '\n';
}

```

## 18_优化_从中序与后序遍历序列构造二叉树_leetcode_106

```cpp
#include <stdio.h>
#include <unordered_map>
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
    // 创建一个inorder 值:索引 的哈希表
    unordered_map<int, int> inorder_vec_map;

    // 采取左闭右开的原则
    TreeNode *buildeTree_help(vector<int> &inorder, int i_start, int i_end,
                              vector<int> &postorder, int p_start, int p_end) {

        // 1.终止条件
        if (!(i_start < i_end && p_start < p_end)) {
            return nullptr;
        }

        // 2.创建根节点
        TreeNode *node = new TreeNode(postorder[p_end - 1]);

        // 3.确定中序分割点
        int node_inorder_index = inorder_vec_map[postorder[p_end - 1]];

        // 4.分割中序数组 左中右
        int i_start_left = i_start;
        int i_end_left = node_inorder_index;

        int i_start_right = node_inorder_index + 1;
        int i_end_right = i_end;
        ;

        // 5.分割后序数组 左右中

        int p_start_left = p_start;
        int p_end_left = p_start_left + i_end_left -
                         i_start_left; // 左闭右开的长度即是 左 - 右

        int p_start_right = p_end_left;
        int p_end_right = p_start_right + i_end_right - i_start_right;
        // 左子树
        node->left = buildeTree_help(inorder, i_start_left, i_end_left,
                                     postorder, p_start_left, p_end_left);
        // 右子树
        node->right = buildeTree_help(inorder, i_start_right, i_end_right,
                                      postorder, p_start_right, p_end_right);
        return node;
    }

public:
    // 参数 前序数组 和 后序数组
    // 返回 对应的树的根节点
    // 1.后序数组为0, 返回空节点
    // 2.后序数组最后一个元素为根节点元素, 创建根节点
    // 3.用根节点元素寻找中序数组的位置, 作为切割点 (这里可以用哈希表优化)
    // 4.切割中序数组
    // 5.切割后序数组
    // 6.递归处理做区间和右区间
    TreeNode *buildTree(vector<int> &inorder, vector<int> &postorder) {
        // 1.创建索引
        for (int i = 0; i < inorder.size(); i++) {
            inorder_vec_map[inorder[i]] = i;
        }

        return buildeTree_help(inorder, 0, inorder.size(), postorder, 0,
                               postorder.size());
    }
};

void inorder_traversal(TreeNode *root) {
    if (root == nullptr) {
        return;
    }
    inorder_traversal(root->left);
    printf("%d ", root->val);
    inorder_traversal(root->right);
}

int main() {
    Solution sol;
    vector<int> inorder = {9, 3, 15, 20, 7};
    vector<int> postorder = {9, 15, 7, 20, 3};
    TreeNode *root = sol.buildTree(inorder, postorder);
    printf("中序遍历结果\n");
    inorder_traversal(root);
    printf("\n中序遍历结果\n");
    return 0;
}
```

## 18_从中序与后序遍历序列构造二叉树_leetcode_106

```cpp
#include <stdio.h>
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

    // 参数 前序数组 和 后序数组
    // 返回 对应的树的根节点
    // 1.后序数组为0, 返回空节点
    // 2.后序数组最后一个元素为根节点元素, 创建根节点
    // 3.用根节点元素寻找中序数组的位置, 作为切割点
    // 4.切割中序数组
    // 5.切割后序数组
    // 6.递归处理做区间和右区间
    TreeNode *buildTree(vector<int> &inorder, vector<int> &postorder) {
        // 发现一个问题, 切割数组会创建非常多的空间
        // 1.终止条件 中序数组和后序数组的合法性题目已经保证
        if (postorder.empty()) {
            return nullptr;
            // 2.找到根节点, 创建根节点
        }

        TreeNode *node = new TreeNode(postorder[postorder.size() - 1]);
        // 3.确定中序数组的分割点
        int index;
        for (index = 0; index < inorder.size(); index++) {
            if (inorder[index] == postorder[postorder.size() - 1]) {
                break;
            }
        }
        // 4.切割中序数组 遵循左闭右开  左中右
        vector<int> inorder_left(inorder.begin(), inorder.begin() + index);

        vector<int> inorder_right(inorder.begin() + index + 1, inorder.end());

        // 5.切割后序数组 遵循左闭右开, 用中序数组的长度  左右中
        
        vector<int> postorder_left(postorder.begin(),
                                   postorder.begin() + inorder_left.size());

        vector<int> postorder_right(postorder.begin() + inorder_left.size(),
                                    postorder.begin() + inorder_left.size() +
                                        inorder_right.size());

        // 6.单层递归, 递归处理的时候以考虑某一层来写
        node->left = buildTree(inorder_left, postorder_left);

        node->right = buildTree(inorder_right, postorder_right);
        return node;
    }
};

void inorder_traversal(TreeNode *root) {
    if (root == nullptr) {
        return;
    }
    inorder_traversal(root->left);
    printf("%d ", root->val);
    inorder_traversal(root->right);
}

int main() {
    Solution sol;
    vector<int> inorder = {9, 3, 15, 20, 7};
    vector<int> postorder = {9, 15, 7, 20, 3};
    TreeNode *root = sol.buildTree(inorder, postorder);
    printf("中序遍历结果\n");
    inorder_traversal(root);
    printf("\n中序遍历结果\n");
    return 0;
}
```
