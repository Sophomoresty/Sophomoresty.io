+++
date = '2025-05-22T12:11:29+08:00'
draft = false
title = '代码随想录_day8'
image = "img/code.jpg"
license = false
categories = [
  "代码随想录",
  "c++"
]
+++

代码仓库: <https://github.com/Sophomoresty/Algorithm_Exercises.git>

## 1_反转字符串I_leetcode_344

```cpp
#include <vector>
using namespace std;
class Solution {

private:
    void swapString(vector<char> &s, int left, int right) {
        char temp = s[left];
        s[left] = s[right];
        s[right] = temp;
    }

public:
    void reverseString(vector<char> &s) {
        int left, right;
        for (left = 0, right = s.size() - 1; left < right; left++, right--) {
            swapString(s, left, right);
        }
    }
};
```

## 2_反转字符串II_leetcode_541

```cpp
#include <string>

using namespace std;

class Solution {
public:
    void swapString(string &s, int left, int right) {
        char temp = s[left];
        s[left] = s[right];
        s[right] = temp;
    }
    // 反转left到right的字符串, 是闭区间
    void reverseString(string &s, int left, int right) {
        for (; left < right; left++, right--) {
            swapString(s, left, right);
        }
    }

    string reverseStr(string s, int k) {

        for (int i = 0; i < s.size(); i += 2 * k) {
            // 反转前k个, 条件是i+k不超出s.size()

            if (i + k < s.size()) {
                this->reverseString(s, i, i + k - 1);
            }
            // 如果剩下的没有k个, 反转剩下的
            else {
                this->reverseString(s, i, s.size() - 1);
            }
        }
        return s;
    }
};
```

## 3_替换数字

```cpp
#include <iostream>
#include <string>

using namespace std;

int main() {
    string s;
    while (cin >> s) {
        int old_len = s.size();
        int count = 0;
        // 1.统计字符中数字出现的次数
        for (auto i : s) {
            if (i >= '0' && i <= '9') {
                count++;
            }
        }
        // 2.每个数字都要替换成number, 也就以为着数组增加5*count
        s.resize(old_len + 5 * count);
        int new_len = s.size();

        // 用双指针遍历
        int left, right;
        for (left = old_len - 1, right = new_len - 1; left > -1; left--) {
            // left的内容是数字
            if (s[left] >= '0' && s[left] <= '9') {
                s[right--] = 'r';
                s[right--] = 'e';
                s[right--] = 'b';
                s[right--] = 'm';
                s[right--] = 'u';
                s[right--] = 'n';
            }
            // left的内容是非数字

            else {
                s[right--] = s[left];
            }
        }
        cout << s << endl;
    }
}
```
