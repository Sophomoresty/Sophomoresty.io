+++
date = '2025-05-22T20:58:14+08:00'
draft = false
title = '代码随想录_day9'
image = "img/code.jpg"
license = false
categories = [
  "代码随想录",
  "c++"
]
+++
代码仓库: <https://github.com/Sophomoresty/Algorithm_Exercises.git>

## 4_翻转字符串里的单词_leetcode_151

```cpp
#include <algorithm>
#include <iostream>
#include <string>
using namespace std;

class Solution {
public:
    string reverseWords(string s) {
        // 1.去除空格
        int slow, fast;
        for (slow = fast = 0; fast < s.size(); fast++) {
            // fast遇到的不是空格, 也就是我们要加入新数组中的元素
            // 除了第一个单词, 其余单词的首字母前面都要加个空格
            if (s[fast] != ' ') {
                // 处理首字母
                // slow==0, 意味着此时加入的是第1个单词
                if (slow == 0) {
                    s[slow++] = s[fast++];
                }
                // slow !=0
                else {
                    s[slow++] = ' ';
                }
                // 处理该单词剩余的字母, 这里主要fast不要超出s.size()
                while (fast < s.size() && s[fast] != ' ') {
                    s[slow++] = s[fast++];
                }
            }
        }
        // slow是新字符串的长度
        s.resize(slow);

        // 反转整个字符串, 再反转每个不含空格的子串

        // 2.反转整个字符串
        reverse(s.begin(), s.end());
        // 现在是反转空格隔开的子串
        int begin = 0;
        // 3.反转子串
        for (int i = 0; i < s.size(); i++) {
            // 最后一个单词后面没有空格
            if (s[i] == ' ') {
                reverse(s.begin() + begin, s.begin() + i);
                begin = i + 1;
                // 反转后更新字符串的起始点
            }
            if (i == s.size() - 1) {
                reverse(s.begin() + begin, s.end());
            }
        }
        return s;
    }
};

int main() {
    string s = "   the       sky       is blue!              ";
    Solution sol;
    string s_res = sol.reverseWords(s);
    cout << s_res << '\n';
}
```
