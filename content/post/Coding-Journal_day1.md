+++
date = '2025-09-03T23:50:58+08:00'
draft = false
title = 'Coding Journal_day1'
image = "img/code.jpg"
license = false
math = true
categories = [
  "代码随想录",
  "c++"
]
+++
代码仓库: <https://github.com/Sophomoresty/Algorithm_Exercises.git>

## 2_二分查找

```c++
#include <vector>
using namespace std;

class Solution {
public:
    // 最后返回目标值的序号
    int search(vector<int> &nums, int target) {
        // 采用左闭右开
        int left = 0, right = nums.size();
        int mid;
        // left<right即合法区间
        while (left < right) {
            mid = left + (right + left) / 2;
            if (target < nums[mid]) {
                right = mid;
            } else if (target > nums[mid]) {
                left = mid + 1;
            }

            // target == mid
            else {
                return mid;
            }
        }
        // 没搜索到
        return -1;
    }
};
```

## 3_移除元素

```c++
#include <vector>
using namespace std;

class Solution {
public:
    int removeElement(vector<int> &nums, int val) {
        // 快慢指针法
        int slow, fast;
        slow = 0;
        for (fast = 0; fast < nums.size(); fast++) {
            if (nums[fast] != val) {
                nums[slow++] = nums[fast];
            }
        }
        //slow指针指向新数组最后1个元素的下1个索引, 数值大小为新数组的元素个数, 即为不等于val的新数组元素个数
        return slow;
    }
};
```

## 4_有序数组的平方

```c++
#include <vector>
using namespace std;

class Solution {
public:
    // 平方后的数组最大值只能出现在两端
    // 比较得到最大值, 放在数组末尾
    vector<int> sortedSquares(vector<int> &nums) {
        int left = 0, right = nums.size() - 1;
        int k = nums.size() - 1;
        vector<int> result(nums.size());

        for (; left <= right;) {
            int nums_left = nums[left] * nums[left];
            int nums_right = nums[right] * nums[right];
            if (nums_left < nums_right) {
                result[k--] = nums_right;
                right--;
            }
            // nums_left >= nums_right
            else {
                result[k--] = nums_left;
                left++;
            }
        }
        return result;
    }
};
```
