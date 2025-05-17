---
date: "2025-05-17T20:31:55+08:00"
title: "代码随想录_day_4_链表"
image: "img/code.jpg"
license: false
categories:
  - "代码随想录"
  - "c++"
---

## 今日BB

前天在配置wsl环境和博客, 昨天只做了`区间和开发商问题`, 链表的任务全部拖到今天解决了, 花了大半天写完了, 链表还剩链表相交, 今天没时间做了.

## 数组收获

开发商题目中最大收获就是在处理行/列分割的时候, 可以用行, 列前缀和处理.

我最原始的思路是n行m列矩阵, 如果按行分割, 这里约定被分割的行及其前面的都属于前一部分的, 列分割同理, 那行分割的序号可以从1到n-1, 按照矩阵的索引来说, 就是 `0` 到 `n-2`.

比如3行的矩阵

- 行分割索引为0, 则分割为[0], [1,2]
- 行分割索引为1, 则分割为[0,1],[2]

同理列分割的索引可以从0到n-2.

想到这里的时候, 我是想把分割后的差值的绝对值求出来, 最后一起求最小值, 但是非常繁琐. 看了卡哥的代码豁然开朗.

```cpp
    int result = INT_MAX;
    int horizontalCut = 0;
    for (int i = 0; i < n; i++) {
        horizontalCut += horizontal[i];
        result = min(result, abs(sum - horizontalCut - horizontalCut));
    }
    int verticalCut = 0;
    for (int j = 0; j < m; j++) {
        verticalCut += vertical[j];
        result = min(result, abs(sum - verticalCut - verticalCut));
    }
    cout << resu
```

`horizontal` 和 `vertical`是前面算出来的矩阵的每行, 毎列的和. `sum`是矩阵所有元素的和, 这里最开始看不懂的是`horizontalCut`干嘛的.

实际上思路和我们前面是一样的, 要求`分割后的差值`.

`i=0`, `horizontalCut`为第1行的和, 而`sum - horizontalCut`即为2,3行的和.

所以`i=0`时, `sum - horizontalCut - horizontalCut`即是分割索引为0时, 上下两部分的差值.

这里的for循环即是把所有分割的可能的差值求出来, 每次都在更新`result`.

美中不足的是, `i < n`不是最精确的范围:

`i = n-1`时, `horizontal`是全部行的和, 这个分割的差值显然是0, 逻辑完善的话, for循环条件应为 `i < n - 1`.

## 链表收获

今天链表比较欠缺的部分是 设计链表 是用不含size属性实现的, 后续要做含size属性的以及双链表.

之前以为数据结构学过链表, 这里没啥问题. 结果在设计链表的边界处理, 犯了很多错误:

- 在链表尾处添加节点, 没有考虑到空节点的情况

两两交换链表中的节点和环形链表中都用了步长为2的指针, 这里最需要注意的就是快指针的边界处理, 很容易操作空指针.
