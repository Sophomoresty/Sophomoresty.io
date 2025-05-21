+++
date = '2025-05-21T17:37:44+08:00'
draft = false
title = '代码随想录_day6'
image = "img/code.jpg"
license = false
categories = [
  "代码随想录",
  "c++"
]
+++

代码仓库: <https://github.com/Sophomoresty/Algorithm_Exercises.git>

最近复习压力比较大, 没有时间做笔记和额外训练, 目前只做了大概的最优解, 后面二轮的时候要补充完

## 5_四数相加II_leetcode_454

```cpp
#include <unordered_map>
#include <vector>

using namespace std;
class Solution {
public:
    //

    // 哈希法
    int fourSumCount(vector<int> &nums1, vector<int> &nums2, vector<int> &nums3,
                     vector<int> &nums4) {
        // 初始定义map
        unordered_map<int, int> res_map;

        //  遍历数组1,2, 对map进行初始化
        for (auto a : nums1) {
            for (auto b : nums2) {
                auto it = res_map.find(a + b);
                // unordered_map在创建未存在的键的时候会自动初始赋值为0,
                // 所以不需要手动初始化 不存在则value赋值为1
                // 存在则value++
                res_map[a + b]++;
            }
        }
        // 定义符合条件的四元组个数
        int count = 0;
        // 遍历数组3,4,在map中找对应的target的value
        for (auto c : nums3) {
            for (auto d : nums4) {
                int target = 0 - (c + d);
                auto it = res_map.find(target);
                // 找到的情况下
                if (it != res_map.end()) {
                    count += res_map[target]; //
                }
            }
        }
        return count;
    }
};
```

## 6_赎金信_leetcode_383

```cpp
#include <cstdio>
#include <iostream>
#include <string>
#include <vector>
using namespace std;
class Solution {
public:
    bool canConstruct(string ransomNote, string magazine) {

        // ransomNote 和 magazine 由小写英文字母组成
        // 可以用长度26的数组作为哈希表, magazing出现过的字符, 对应值+1,
        // for循环遍历ransomNote, 看哈希表中有没有对应的字符
        vector<int> res_vec(26, 0);
        for (auto i : magazine) {
            res_vec[i - 'a']++;
        }

        for (auto i : ransomNote) {
            if (res_vec[i - 'a'] > 0) {
                res_vec[i - 'a']--;
            } else {
                return false;
            }
        }
        return true;
    }
};

int main() {
    string ransomNote = "aa";
    string magazine = "aab";
    Solution sol;
    bool flag = sol.canConstruct(ransomNote, magazine);
    // canConstruct("a", "b") -> false
    printf("canConstruct(\"%s\", \"%s\") -> %s\n", ransomNote.c_str(),
           magazine.c_str(), flag ? "true" : "false");
    return 0;
}
```

## 7_三数之和_leetcoe_15

```cpp
#include <algorithm>
#include <vector>
using namespace std;
class Solution {
public:
    vector<vector<int>> threeSum(vector<int> &nums) {
        // 0. 处理边界情况：如果元素数量不足3个，直接返回空
        if (nums.size() < 3) {
            return {};
        }

        // 最后返回的值是多个三元组, 三元组的内容设为[i,j,k], ijk的和为0,
        // 且ijk的序号不能相同, 三元组不能重复
        // 对数组进行排序
        sort(nums.begin(), nums.end());
        // 如果最小值大于0, 也就以为三元组不可能存在, 返回空;
        if (nums[0] > 0) {
            return {};
        }
        vector<vector<int>> res_vec;
        // 对数组进行遍历
        // 使用i, left, right就是为了避免序号相同
        // 对i, left, right去重, 是为了避免三元组重复
        for (int i = 0; i < nums.size() - 2; i++) {
            // 进入循环前需要去i的重, 重复的情况下结束本次循环
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            // 定义left和right指针
            int left = i + 1;
            int right = nums.size() - 1;
            // right指针永远指向末尾会不会重复? 不会, 因为i去重了
            // 因为序号不能相同, 也就是退出循环时, right =left
            while (right > left) {
                int temp = nums[i] + nums[left] + nums[right];
                if (temp > 0) {
                    right--;
                } else if (temp < 0) {
                    left++;
                }
                // temp = 0;
                else {
                    res_vec.push_back({nums[i], nums[left], nums[right]});
                    // 当i,left,right的值刚好为0时, 此时i是固定的,
                    // 如果只动right或则left, 是找不到值的 也就是这种情况下,
                    // 为了找继续可能存在的值, left和right都必须收缩
                    do {
                        left++;
                    }
                    // 对left和while去重, 必须用循环处理, 退出条件是前后不相等,
                    // 这有可能导致right和left错位
                    // 综上, 循环条件是前后相等 且 left < right
                    while (nums[left] == nums[left - 1] && left < right);

                    do {
                        right--;
                    } while (nums[right] == nums[right + 1] && left < right);
                }
            }
        }
        return res_vec;
    }
};
```

## 8_四数之和_leetcode_18

```cpp
#include <algorithm>
#include <cstddef>
#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> one_fourSum(vector<int> &nums, int target) {

        vector<vector<int>> res_vec; // vector初始化的数组为空
        sort(nums.begin(), nums.end());
        // 0.处理边界情况
        if (nums.size() < 4) {
            return {};
        }
        // i最多到nums.size()-4
        for (int i = 0; i < nums.size() - 3; i++) {

            // 1.1 i剪枝
            // target大于0的情况下, nums[i]如果大于target, 则无解,
            // 而且意味着后续的i也无解, 所以要结束循环, 而不是结束本次循环
            // target >= 0 , nums[i]可否等于target
            // target =0的情况下, num[i]=target=0,后续的值也可以找到四元组,
            // 比如{0,0,0,0}, 因为数组单调不减
            // 总结
            // target=0 , nums[i] > target
            // target >0的情况, nums[i] >=target

            if (target == 0 && nums[i] > target ||
                target > 0 && nums[i] >= target) {
                break;
            }
            // 1.2 i去重
            // i重复的情况下, 结束本次循环
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            for (int j = i + 1; j < nums.size() - 2; j++) {
                // 2.1 j 剪枝
                // 在有i的基础上, 如果targe >= 0, nums[i] + nums[j] >= target
                // >=0 ,也就意味着不可能是目标的四元组
                if (target == 0 && nums[i] + nums[j] > target ||
                    target > 0 && nums[i] + nums[j] >= target) {
                    break;
                }

                // 2.2 j去重
                // j > 1 && nums[j] == nums[j - 1])
                // 这个去重逻辑有问题,i和j的值可以相等
                // 实际上这里要避免的是i和j同时和上一轮的相同
                // 也就是结束循环的条件是j>1, i和上一轮的相同且j和上一轮相同
                // i的初始值是0, j的初始值是1, 也就是j要大于1
                if (j > i + 1 && nums[j] == nums[j - 1]) {
                    continue;
                }

                int left = j + 1;
                int right = nums.size() - 1;
                while (left < right) {
                    long long temp =
                        (long long)nums[i] + nums[j] + nums[left] + nums[right];
                    if (temp > target)
                        right--;
                    else if (temp < target)
                        left++;
                    // temp=target
                    else {
                        // 添加四元组
                        res_vec.push_back(
                            {nums[i], nums[j], nums[left], nums[right]});
                        // 去重
                        do {
                            left++;
                        } while (nums[left] == nums[left - 1] && left < right);

                        do {
                            right--;
                        } while (nums[right] == nums[right + 1] &&
                                 left < right);
                    };
                }
            }
        }
        return res_vec;
    }
    vector<vector<int>> fourSum(vector<int> &nums, int target) {
        vector<vector<int>> res_vec;
        if (nums.size() < 4)
            return res_vec;
        sort(nums.begin(), nums.end());
        size_t length = nums.size();
        for (int i = 0; i < length - 3; i++) {
            // 1.剪枝
            // 最小的组合都大于target ,无解, break
            if ((long long)nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] >
                target) {
                break;
            }
            // 初始值加最大的三个组合都小于target, 说明当前值肯定不行
            if ((long long)nums[i] + nums[length - 3] + nums[length - 2] +
                    nums[length - 1] <
                target) {
                continue;
            }
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }

            for (int j = i + 1; j < length - 2; j++) {
                if ((long long)nums[i] + nums[j] + nums[j + 1] + nums[j + 2] >
                    target) {
                    break;
                }

                if ((long long)nums[i] + nums[j] + nums[length - 2] +
                        nums[length - 1] <
                    target) {
                    continue;
                }

                if (j > i + 1 && nums[j] == nums[j - 1]) {
                    continue;
                }

                int left = j + 1;
                int right = nums.size() - 1;
                while (left < right) {
                    long long sum =
                        (long long)nums[i] + nums[j] + nums[left] + nums[right];
                    if (sum > target) {
                        right--;
                    } else if (sum < target) {
                        left++;
                    } else {
                        res_vec.push_back(
                            {nums[i], nums[j], nums[left], nums[right]});
                        do {
                            left++;
                        } while (left < right && nums[left] == nums[left - 1]);
                        do {
                            right--;
                        } while (left < right &&
                                 nums[right] == nums[right + 1]);
                    }
                }
            }
        }
        return res_vec;
    }
};

int main() {
    vector<int> nums = {-2, -1, -1, 1, 2, 2};
    int target = 0;
    Solution sol;
    vector<vector<int>> res_vec = sol.fourSum(nums, target);
    for (auto i : res_vec) {
        cout << "[";
        for (auto j : i) {
            cout << j << ", ";
        }
        cout << "]" << '\n';
    }
}

```
