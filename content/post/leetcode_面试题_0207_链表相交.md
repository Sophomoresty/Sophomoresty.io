+++
date = '2025-05-18T16:22:06+08:00'
draft = false
title = 'Leetcode_面试题_0207_链表相交'
image = "img/code.jpg"
license = false
categories = [
  "代码随想录",
  "c++"
]
+++

## 双指针法1(卡哥思路)

### 思路和总结

把链表想象为一根绳子, 让绳子右端点对齐

1.分别遍历A,B两个链表, 得出A,B的长度
2.让长链表的初始指针移动到, 和短链表初始指针对齐

本次题暴露了自己循环体理解的问题, while和for是等价的

写好循环体, 一般是通过`对应关系`去写条件

对应关系: `本次循环体刚进来的判别的对象` 和 `对应的变化值`

### 代码

```cpp
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        // 处理长度为0的情况
        if (headA == nullptr || headB == nullptr) {
            return nullptr;
        }

        // 1. 计算链表长度
        // 链表的索引从0开始
        ListNode *curA, *curB;
        curA = headA;
        int len_A, len_B;
        len_A = 0;
        len_B = 0;
        // curA是判别对象
        while (curA != nullptr) {
            curA = curA->next;
            len_A++;
            // 索引 0 -> 长度 1, 正确
        }

        curB = headB;
        while (curB != nullptr) {
            curB = curB->next;
            len_B++;
        }

        // 2. 重置指针
        curA = headA;
        curB = headB;
        // 3. 将长链表的指针向前移动长度差的步数进行对齐
        if (len_A > len_B) {
            // 从0移动到LA-LB,步数为LA-LB
            for (int i = 1; i <= (len_A - len_B); i++) {
                curA = curA->next;
            }
        }
        if (len_A < len_B) {
            for (int i = 1; i <= (len_B - len_A); i++) {
                curB = curB->next;
            }
        }
        // 现在curA和curB在同一起点, 同时出发

        while (curA != nullptr && curB != nullptr) {
            if (curA == curB) {
                return curA;
            }
            curA = curA->next;
            curB = curB->next;
        }
        return nullptr;
    }
};
```

## 双指针法2

### 思路和总结

设A独有的长度为a, 和B相同的部分为c;
设B独有长度为b, 和A相同的部分为c;
让A,B链表拼接在一起.

1 A,B有相同的部分

- urA 从 A 端出发, curB 从 B 端出发,
- curA 第一次到达相同部分, 移动的距离是`a-1`
- curA 第二次到达相同部分, 移动的距离是`a+c-1+b`
- curB 第一次到达相同的部分, 移动的距离是`b-1`
- curB 第二次到达相同的部分, 移动的距离是`b+c-1+a`

即A,B有相同的部分, 它们一定会移动相同的距离 `a+b+c-1`, 遇到第一个相等的对象.

2 A, B没有相同的部分

A,B会走完全程, 遇到1个相等的对象 nullptr

总结:
通过让两个指针走的总路程相等(LA+LB)，它们一定会在某个时刻相遇。
而这个相遇点，必然是它们第一次同时到达的、在两条“加长”路径上具有相同相对位置的那个点，也就是`相交点`（如果存在的话），或者最终的 `nullptr`（如果不相交的话）。

### 代码

```cpp
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        if (!headA || !headB)
            return nullptr;

        ListNode *curA, *curB;
        curA = headA;
        curB = headB;
        // 循环退出条件, curA, curB相等
        while (curA != curB) {

            curA = curA == nullptr ? headB : curA->next;
            curB = curB == nullptr ? headA : curB->next;
        }

        return curA;
    }
};
```

## 暴力解法

### 总结

原始错误

循环嵌套需要初始化curB, 此前没有初始化curB

### 代码

```cpp
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        // 0个节点
        if (headA == nullptr || headB == nullptr) {
            return nullptr;
        }

        // 暴力解法, 同时遍历A和B, 有个相等时即return
        ListNode *curA = headA;

        while (curA != nullptr) {
            ListNode *curB = headB; // 注意要初始化
            while (curB != nullptr) {
                if (curA == curB) {
                    return curA;
                }
                curB = curB->next;
            }
            curA = curA->next;
        }
        return nullptr;
    }
};
```
