---
title: Python 关键词问题
category: Python
tags: [Python, 关键词]
date: 2024-01-23
---

yield等同于返回+记忆, 
第一次运行后, 第二次运行后, 会从第一次yielde开始, 不包括其, 继续运行

with关键字, 是上下文管理器
with 语句A
	语句B
	(自动调用__exit__方法)
执行语句A, 语句B, 最后一定会执行语句A对应的结尾操作, 即with语句会在嵌套快的模块调用__exit__方法