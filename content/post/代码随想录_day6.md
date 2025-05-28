+++
date = '2025-05-19T19:00:30+08:00'
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

## 1_有效的字母异位词_leetcode_242

### 未完成的任务

对unicode的情况进行处理

### 1. 暴力解法

```cpp
// 暴力解法
// 遍历s,t两个数组, 对s中每一个字符, 在t中找到对应的字符,
// 为了防止重复匹配到已匹配的字符, 需要对匹配的字符进行换值, 因此t需要备份,
bool baoli_isAnagram(string s, string t) {
    // 长度不等直接false
    if (s.length() != t.length()) {
        return false;
    }
    // 因为要对t修改, 提前备份
    string t_backup = t;

    // 定义1个bool值, 表示当前s的字符是否匹配上t了
    bool found;
    for (int i = 0; i < s.length(); i++) {
        found = false;
        for (int j = 0; j < t_backup.length(); j++) {
            // 如果相等的话
            if (s[i] == t_backup[j]) {
                found = true;
                t_backup[j] = '#'; // 对匹配到的字符进行更替, 防止重复匹配
                break; // s的字符已经找到了对应的字符, 没必要找了
            }
        }
        // s的一个字符在t中没找到, 直接返回false
        if (found == false) {
            return false;
        }
    }
    return true;
}
```

### 2. 数组哈希解法_最优解

```cpp
// 只处理小写字母, 而不是unicode编码, 小写字母的ascii码有26个,
// 所以只需要长度为26的数组, 遍历s,t将每个字符映射到数组的索引, 然后++
// 如果数组中的值均为2, 则s,t是字母异位词, 有问题,
// 字符串里面的字符可以重复出现,
// 也就是出现偶数个才是正确的, 还是有问题, 如果是 aa 和 bb,也会是偶数
// 所以最好的思路是, t中的字符++, s中的字符--,
// 如果字符在数组中对应的值为0的话, 也就意味着字符相等
bool isAnagram(string s, string t) {
    if (s.length() != t.length()) {
        return false;
    }

    vector<int> hash_vec(26);
    for (int i = 0; i < s.length(); i++) {
        hash_vec[s[i] - 'a']++;
        hash_vec[t[i] - 'a']--;
    }
    for (int i = 0; i < hash_vec.size(); i++) {
        if (hash_vec[i] != 0) {
            return false;
        }
    }
    return true;
}
```

## 2_两个数组的交集_leetcode_349

### 1. 暴力解法

```cpp
// 用1个额外的数组存储交点 (这个做法是错误的, 数组无法去重)
// 空间复杂度o(min(n,m)), 时间复杂度o(n*m)
vector<int> baoli_intersection(vector<int> &nums1, vector<int> &nums2) {
    unordered_set<int> intersection_set;
    for (int i = 0; i < nums1.size(); i++) {
        for (int j = 0; j < nums2.size(); j++) {
            if (nums1[i] == nums2[j]) {
                intersection_set.insert(nums1[i]);
                break;
            }
        }
    }
    return vector<int>(intersection_set.begin(), intersection_set.end());
}
```

### 2. 哈希集合解法

```cpp
// 哈希集合解法
vector<int> intersection(vector<int> &nums1, vector<int> &nums2) {

    // unordered_set无序, 数值不可以重复, 值不能更改,
    // 所以存储结果必须单开集合

    // 找到长, 短数组
    vector<int> nums_short = nums1.size() < nums2.size() ? nums1 : nums2;
    vector<int> nums_long = nums1.size() < nums2.size() ? nums2 : nums1;

    unordered_set<int> nums_set(nums_short.begin(), nums_short.end());
    unordered_set<int> res_set;
    for (int num : nums_long) {
        // 在nums_set中找有没有相同的值, 有则加入
        // find的结果
        // 1. 找到的情况下返回当前值的迭代器
        // 2.没找到的情况下返回nums_set.end()
        if (nums_set.find(num) != nums_set.end()) {
            res_set.insert(num);
        }
    }
    return vector<int>(res_set.begin(), res_set.end());
    // 1.时间复杂度分析
    // 循环中需要遍历长数组, 最坏情况下, 时间复杂度为o(max(n,m))

    // 2.空间复杂度分析
    // 2.1 将最小数组存入集合中, 空间复杂度o(min(n,m))
    // 2.2 res_set用于存放相交的值, 空间复杂度为o(k), k<= o(min(n,m))
    // 2.3 最后返回的数组, 空间复杂同为o(k)
    // 综合来看, 空间复杂度为o(min(n,m))
}
```

### 3. 数组+哈希集合_最优解

```cpp
// 最优解
// 由于题目规定了数值仅在0-1000,
// 最开始放短数组的值可以放在数组中, 数组的开销小, 能用数组就不要用set,
// 使用数字必须在空间确定的情况下, 不确定的情况习, 容易造成空间浪费,
// 这种情况下用set 所以存放数值还是必须要放在哈希表中, 因为最后要不重复
vector<int> better_intersection(vector<int> &nums1, vector<int> &nums2) {
    vector<int> nums_array(1001, 0);
    unordered_set<int> res_set;

    // 找到长短数组
    vector<int> nums_short = nums1.size() < nums2.size() ? nums1 : nums2;
    vector<int> nums_long = nums1.size() < nums2.size() ? nums2 : nums1;

    // 遍历短数组, 用其值作为索引, 出现的情况下+1, 后续判断是否相交,
    // 即对长数组遍历, 判断其值的索引的值是否为1即可
    for (int num : nums_short) {
        nums_array[num] = 1;
    }

    for (int num : nums_long) {
        if (nums_array[num] == 1) {
            res_set.insert(num);
        }
    }
    return vector<int>(res_set.begin(), res_set.end());
}


```

## 3_快乐数_leetcode_202

### 1. 哈希集合法

```cpp
int get_sum(int n) {
    int sum = 0;
    while (n) {
        sum += (n % 10) * (n % 10);
        n = n / 10;
    }
    return sum;
}
bool isHappy(int n) {
    unordered_set<int> res_set;
    int sum;
    while (true) {
        sum = get_sum(n);
        if (sum == 1) {
            return true;
        }
        if (res_set.find(sum) != res_set.end()) {
            return false;
        } else {
            res_set.insert(sum);
        }
        n = sum;
    }
}

```

### 2. 快慢指针法_最优解

- 自己最初写的, 写的很繁琐, 没要考虑到fast和slow, 无论是有解还是无解, 最终都要相等, 有解的情况下相等值为1, 无解的情况下相等值非1

```cpp
// 因为无解的情况下, 会陷入循环, 陷入循环的情况下,
// 如果快指针和慢指针同时出发, 快指针一定会套圈, 追上慢指针
// 比如 2 -> 4 -> 16 -> 37 -> 58 -> 89 -> 145 -> 42 -> 20 -> 4
// 有解的情况下, 没有循环 比如
// 1 -> 1 -> 1

bool better_isHappy(int n) {

    int slow, fast;
    // 初始化

    slow = get_sum(n);
    fast = get_sum(n);
    fast = get_sum(fast);

    if (fast == 1) {
        return true;
    }

    // 也就是无解的情况下, 一定会退出循环, 有解的情况下, 快指针一定为1
    while (fast != slow) {

        if (fast == 1) {
            return true;
        }
        slow = get_sum(slow);
        fast = get_sum(fast);
        fast = get_sum(fast);
    }
    return false;
}
```

- 参考答案写的

```cpp
bool better_2_isHappy(int n) {
    int fast, slow;
    fast = slow = n;
    // // 初始化
    // slow = get_sum(slow);
    // fast = get_sum(fast);
    // fast = get_sum(fast);
    // 快指针和慢指针在哪种情况下都会相遇, 无解的情况下相遇的值不为1,
    // 有解的情况相遇的值为1
    do {
        slow = get_sum(slow);
        fast = get_sum(fast);
        fast = get_sum(fast);
    } while (fast != slow);

    return slow == 1;
}
;

```

## 4_两数之和_leetcode_1

### 1. 暴力解法

```cpp
vector<int> baoli_twoSum(vector<int> &nums, int target) {
    // 暴力做法
    // 遍历嵌套两次
    for (int i = 0; i < nums.size(); i++) {
        for (int j = i + 1; j < nums.size(); j++) {
            if (nums[i] + nums[j] == target) {
                return vector<int>{i, j};
            }
        }
    }
}
```

### 2. map解法_最优解

```cpp
vector<int> twoSum(vector<int> &nums, int target) {
    // 遍历nums数组, 在map中找target-遍历值,
    // 找到了则输出它们的index
    // 找不到则在map中存储 遍历值:index
    unordered_map<int, int> nums_map;
    for (int i = 0; i < nums.size(); i++) {

        auto itter = nums_map.find(target - nums[i]);

        // 找到这个元素的情况下
        if (itter != nums_map.end()) {
            // 返回这对键值对
            return vector<int>{nums_map[target - nums[i]], i};
        }
        // 没找到这个元素的情况下
        else {
            nums_map.insert({nums[i], i});
        }
    }
    // 如果没有找到符合条件的两个数，返回空vector
    return {};
}
```
