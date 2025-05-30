+++
date = '2025-05-18T16:41:36+08:00'
draft = false
title = 'leetcode_707_设计链表_用size和tail'
image = "img/code.jpg"
license = false
categories = [
  "代码随想录",
  "c++"
]
+++
代码仓库: <https://github.com/Sophomoresty/Algorithm_Exercises.git>

## 总结

虚拟头结点的序号记为-1, 头结点记为0

tail节点, 一直指向最后1个节点

tail节点更新的情况

1.链表0个节点, 头部插入
2.尾部插入
3.任意序号插入, 尾部插入

## 易错

### addAtIndex

1. 没有处理 index > _size 的情况
2. 添加到尾部的条件错误, 添加到尾部的正确条件是 index == _size

### deleteAtIndex

1.没更新_size
2.temp指针的空间删除后, 要指向空
3.没有考虑删除尾结点的时候, 要更新_tail
4.没有考虑到删除节点后, 链表为空, 要更新_tail

## 代码

```cpp
// 定义链表
struct LinkNode {
    int val;
    struct LinkNode *next;
    // 构造函数体
    LinkNode() : val(0), next(nullptr) {}
    LinkNode(int x) : val(x), next(nullptr) {}
    LinkNode(int x, LinkNode *node) : val(x), next(node) {}
};

class MyLinkedList {
private:
    int _size;
    LinkNode *_dummyHead;
    LinkNode *_tail;

public:

    MyLinkedList() {
        _size = 0;
        _dummyHead = new LinkNode();
        _tail = _dummyHead;

    }

    int get(int index) {
        // 判断是否有效 index
        if (index < 0 || index > _size - 1) {
            return -1;
        }
        LinkNode *cur = _dummyHead;
        for (int i = 0; i <= index; i++) {
            cur = cur->next;
        }
        return cur->val;
    }

    void addAtHead(int val) {
        LinkNode *new_node = new LinkNode(val);
        new_node->next = _dummyHead->next;
        _dummyHead->next = new_node;
        if (_size == 0) {
            _tail = new_node;
        }
        _size++;
    }

    void addAtTail(int val) {
        LinkNode *new_node = new LinkNode(val);
        _tail->next = new_node;
        _tail = new_node;
        _size++;
    }

    void addAtIndex(int index, int val) {
        // 原始错误
        // 1. inde>_size, 没有处理
        // 2. 添加到尾部的判断错误, 添加到尾部的添加是index==_size

        if (index > _size) {
            return;
            // index <=0 头部插入
        }
        if (index <= 0) {
            addAtHead(val);
            return;
        }

        // index = _size-1, 不是尾部插入 , 理解错了, _size-1是尾结点,
        // index = _size-1 插入实际上是后面的逻辑
        if (index == _size) {
            addAtTail(val);
            return;
        }
        // 0 < index < _size
        LinkNode *cur = _dummyHead;
        LinkNode *new_node = new LinkNode(val);
        // 在index处停止
        for (int i = 0; i < index; i++) {
            cur = cur->next;
        }
        new_node->next = cur->next;
        cur->next = new_node;
        _size++;
    }

    void deleteAtIndex(int index) {
        // 原始错误
        // 1.没更新_size
        // 2.temp指针的空间删除后, 要指向空
        // 3.没有考虑删除到尾结点的时候, _tail的更新
        // 4.没有考虑到删除后, 链表为空的情况
        if (index < 0 || index > _size - 1) {
            return;
        }
        LinkNode *cur = _dummyHead;
        for (int i = 0; i < index; i++) {
            cur = cur->next;
        }
        LinkNode *temp = cur->next;
        // 删除的是尾结点
        if (temp == _tail) {
            _tail = cur;
        }
        cur->next = cur->next->next;
        delete temp;
        temp = nullptr;
        _size--;
        // 删除后如果长度为0
        if (_size == 0) {
            _tail = _dummyHead;
        }
    }
    ~MyLinkedList() {
        LinkNode *current = _dummyHead;
        while (current != nullptr) {
            LinkNode *next = current->next; // 先保存下一个节点的地址
            delete current;                 // 删除当前节点
            current = next;                 // 移动到下一个节点
        }
        _dummyHead = nullptr; // 删除完后，将头指针置空
        _tail = nullptr;      // 尾指针也置空
        _size = 0;            // 尺寸归零
    }
};
```
