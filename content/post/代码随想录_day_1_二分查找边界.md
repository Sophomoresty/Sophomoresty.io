---
date: "2025-05-16T15:39:59+08:00"
title: "代码随想录_day_1_二分查找边界"
image: "img/lucy_1.png"
license: false
categories:
  - "代码随想录"
  - "c++"
---

## 今日收获

基础题1-6都做完了, 比想象中的简单. 今天学习到最多的就是力扣编号34的, 在排序数组中查找元素的第一个和最后一个位置.

我原本以为这个和二分查找一样简单, 但发现这个是用二分查找边界. 和卡哥在二分查找的循环变量不同, 思考了2个小时才搞懂, 特此记录下笔记.

## 二分查找边界思路

左边界即数组中第1个大于等于`target`的值, 右边界即数组中第1个大于target的值.

以二分查找右边界为例, 我们这里采用的循环不变量是`[0, left), [right,n)`.

这里的n即为数组长度, 采用左闭右开的方式.

按照循环不变量的思路, 初始化`left=0`, `right=nums.size()`. 循环结束条件是`left < right`.

精彩的地方来了, 我们如何查找到右边界呢?

我们只要保证

- `[0, left)`的数组值严格小于等于`target`

- `[right,n)`的值严格`大于target`
然后不断扩大它们的范围, 直至left=right. 它们相等的值左边小于target, 而这个值本身又大于等于target, 故得出它是第一个大于target的值, 即查找到右边界了, 以上都是建立在target在数组中的.

如果不在数组中呢?

1.target在数组的左侧外
2.target在数组的右侧外
3.targe在数组中, 但数组中没有target的这个值

带入思考, 发现依然能够得出正确的值, 1的右边界索引为0, 2的右边索引为n, 3的右边界索引即为第1个大于target的值的索引.

左边界的思路同理, 只要保证

- `[0, left)`的数组值严格小于`target`

- `[right,n)`的值严格大于等于`target`

```cpp
#include <vector>
#include <iostream>

using namespace std;

class Solution
{
public:
    vector<int> searchRange(vector<int> &nums, int target)
    {
        int left_border = LeftBorder(nums, target);

        if (left_border == int(nums.size()) || nums[left_border] != target)
        {
            return {-1, -1};
        }
        int right_border = RightBoreder(nums, target) - 1;
        return {left_border, right_border};
    }

private:
    int RightBoreder(vector<int> &nums, int target)
    {
        // 缩小区间找第一个大于target的值
        int left, right, mid;
        right = int(nums.size());
        left = 0;
        while (left < right)
        // [right,n-1)的值严格大于targt
        // [0, left)的值严格小于等于target
        // 最后left==right
        {
            mid = left + ((right - left) / 2);

            if (nums[mid] > target)
            {
                right = mid;
            }
            // nums[mid] <= target
            // 因为left处于开的位置, 已知mid<=target, 故left = mid+1
            else
            {
                left = mid + 1; //
            }
        }
        return left;
    }
    int LeftBorder(vector<int> &nums, int target)
    {
        int left, right, mid;
        left = 0;
        right = int(nums.size());
        while (left < right)
        {

            mid = left + (right - left) / 2;
            if (nums[mid] >= target)
            {
                right = mid;
            }

            // nums[mid] < target
            else
            {
                left = mid + 1;
            }
        }
        return left;
    }
};

int main()
{
    vector<int> nums = {5,7,7,8,8,10};
    int target = 8;
    Solution s;
    vector<int>result = s.searchRange(nums,target);
    cout <<"Result for "<< target << ": [" << result[0] << ", " << result[1] << "]" << endl; 
    return 0;
}

```
