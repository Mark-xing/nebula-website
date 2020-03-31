---
title: "Pick of the Week'20 | 第 3 周看点--Nebula Graph Studio 来了"
date: 2020-01-17
description: "本周看点：Index 支持获取给定点的所有属性，Spark Writer 支持将不同数据源数据插入同一 Tag / Edgetype…"
tags: ["社区","产品动态"]
author: 清蒸
---

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW.png)

> 每周五 Nebula 为你播报每周看点，每周看点由本周大事件、用户问答、Nebula 产品动态和推荐阅读构成。

这是 2020 年第 3 个工作周的周五，春季大假离你还有不到 1 周时间，Are u ready 🌝 来和 Nebula 看下本周图数据库和 Nebula 有什么新看点~~

## 本周大事件

### Nebula Graph Studio 来了

Nebula Graph Studio 是一款可视化的图数据库 Web 应用，集构图、数据导入、图探索于一体，无缝连接图数据库，给用户带来全新的图数据库使用体验

1. 安装包地址：[https://github.com/vesoft-inc/nebula-web-docker](https://github.com/vesoft-inc/nebula-web-docker)
1. 用户手册：[https://github.com/vesoft-inc/nebula-web-docker/blob/master/docs/nebula-graph-studio-user-guide.md](https://github.com/vesoft-inc/nebula-web-docker/blob/master/docs/nebula-graph-studio-user-guide.md)

使用过程中有任何问题欢迎前去 GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula) 或者添加 Nebula Graph 小助手（微信：NebulaGraphbot ）为好友来反馈哟~~

## Nebula 产品动态

Pick of the Week 每周会从 GitHub issue 及 pr 中选取重要的产品动态和大家分享，欢迎阅读本文的你关注我们的 GitHub：[https://github.com/vesoft-inc/nebula](https://0x7.me/zhihu2github) 及时了解产品新动态~

- Storage 层新增批量模式扫描接口，用于接入图计算和图神经网络。标签： `Storage` ，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1381](https://github.com/vesoft-inc/nebula/pull/1381)
- `FETCH PROP` 获取点的属性时，新增返回 VertexID；获取边的属性时，新增返回边的 src，dst， rank 值，标签： `nGQL` ，示例如下，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1618](https://github.com/vesoft-inc/nebula/pull/1618)

```shell
(user@127.0.0.1:3777) [test]> FETCH PROP ON person 1016,1017,1018
=======================================================
| VertexID | person.name | person.age | person.gender |
=======================================================
| 1017     | HeNa        | 11         | female        |
-------------------------------------------------------
| 1016     | Sonya       | 11         | male          |
-------------------------------------------------------
| 1018     | Tom         | 12         | male          |
-------------------------------------------------------
Got 3 rows (Time spent: 3.489/5.01 ms)

Fri Jan 17 11:45:28 2020

(user@127.0.0.1:3777) [test]> FETCH PROP ON is_schoolmate 1016->1017,1016->1018
=====================================================================================================================
| is_schoolmate._src | is_schoolmate._dst | is_schoolmate._rank | is_schoolmate.start_year | is_schoolmate.end_year |
=====================================================================================================================
| 1016               | 1017               | 0                   | 2015                     | 2019                   |
---------------------------------------------------------------------------------------------------------------------
| 1016               | 1018               | 0                   | 2014                     | 2019                   |
---------------------------------------------------------------------------------------------------------------------
Got 2 rows (Time spent: 3.425/4.922 ms)
```

- Spark Writer 支持将不同数据源数据插入同一 Tag / Edgetype，标签： `数据导入` ，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1512](https://github.com/vesoft-inc/nebula/pull/1512)
- 支持获取给定点的所有属性，标签： `Index` ，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1468](https://github.com/vesoft-inc/nebula/pull/1468)

## 社区问答

Pick of the Week 每周会从微博、知乎、微信群、微信公众号及 CSDN 等技术社区选取 3 - 5 个用户问题同你分享，欢迎阅读本文的你通过知乎、微信公众号后台或者添加 Nebula 小助手微信号：NebulaGraphbot 进群交流。

- @菜鸡Freamer 提问
> 是否会考虑内置实现更多图算法呢 page rank、random walk，最短路径之类的

**Nebula**：在 Nebula Graph 中最短路径已经有了（文档链接：[https://github.com/vesoft-inc/nebula/blob/master/docs/manual-EN/2.query-language/4.statement-syntax/4.graph-algorithms/find-path-syntax.md](https://github.com/vesoft-inc/nebula/blob/master/docs/manual-EN/2.query-language/4.statement-syntax/4.graph-algorithms/find-path-syntax.md)），Random walk 还在设计中，至于 PageRank 我们虑集成其他框架不内置（可以看到存储层的接口已经相应增加）。欢迎你有任何问题向我们提 issue 哈，GitHub 传送门：https://github.com/vesoft-inc/nebula

- @〒宸〒 提问
> 基于 OwnThink 的数据做查询，目前只能查到 out 方向，如何查询 in 和 out


**Nebula**：在 nGQL（Nebula 图查询语言） 中 in 可用 reversely。both 这里还少个语法糖，所以写起来有点长。现在还只能自己 union，可以参考反向遍历的文档：[https://github.com/vesoft-inc/nebula/blob/master/docs/manual-CN/2.query-language/4.statement-syntax/2.data-query-and-manipulation-statements/go-syntax.md](https://github.com/vesoft-inc/nebula/blob/master/docs/manual-CN/2.query-language/4.statement-syntax/2.data-query-and-manipulation-statements/go-syntax.md) （示例如下）和 UNION 的文档：[https://github.com/vesoft-inc/nebula/blob/master/docs/manual-CN/2.query-language/2.functions-and-operators/set-operations.md#unionunion-distinctunion-all](https://github.com/vesoft-inc/nebula/blob/master/docs/manual-CN/2.query-language/2.functions-and-operators/set-operations.md#unionunion-distinctunion-all)。另外有个 pr 在完善这个语法糖，欢迎一起参与语法设计：[https://github.com/vesoft-inc/nebula/pull/1641](https://github.com/vesoft-inc/nebula/pull/1641) 

```shell
nebula> GO FROM 125 OVER follow REVERSELY YIELD follow._src AS id | 
        GO FROM $-.id OVER serve WHERE $^.player.age > 35 YIELD $^.player.name AS FriendOf,           $$.team.name AS Team

=========================
| FriendOf    | Team    |
=========================
| Tim Duncan  | Spurs   |
-------------------------
| Tony Parker | Spurs   |
-------------------------
| Tony Parker | Hornets |
-------------------------

nebula> GO FROM 1 OVER e1 YIELD e1._dst AS id, e1.prop1 AS left_1, $$.tag.prop2 AS left_2   
        UNION /* DISTINCT */     
        GO FROM 2,3 OVER e1 YIELD e1._dst AS id, e1.prop1 AS right_1, $$.tag.prop2 AS right_2
```

- @菜鸡Freamer 提问
> 你好，我有几个问题想请教一下：1. 客户端查询结束后打印的两个时间点分别是什么时间；2. 最短路径算法的实现方式是否就是根据谷歌 Pregel 模式实现的

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200301.png)

**Nebula**：前面一个参数 718 是指 query engine 收到 console 这条命令开始到存储获取数据并进行一系列计算之后再回复 console 之前整条链路花的时间，后面一个参数 1354 是 console 发送请求前到收到响应并将结果输出到控制台的时间。例子参考这篇文章：[https://zhuanlan.zhihu.com/p/98515952](https://zhuanlan.zhihu.com/p/98515952)。第二个问题，Nebula Graph 的最短路径算法实现是双向搜索的 floyd，后续会进行优化，最短路径以及全路径进行针对性实现。比如最短路径实现双向 BFS，双向 Dijkstra 等。

> 用户追问：对于第二个问题，因为整个存储是分布式的，这些算法是怎么在分布式存储上运行的呢

**Nebula**：我们 Query Engine 与 Storage 是分离的，目前算法是在 Query Engine上实现的，不是在 Storage 层实现。

## 推荐阅读

- [聊聊图数据库和图数据库的小知识 Vol.02](https://nebula-graph.io/cn/posts/graph-database-knowledge-volume-2/)
  - 推荐理由：在本文中讨论了【传统数据库通过设计良好的数据结构是不是可以实现图数据库的功能】、【图数据库会出于什么考虑做存储计算分离】等图数据库设计问题，如果你在设计图数据库，或者分布式数据库不妨来看看 :)
- 往期 Pick of the Week
  - [Pick of the Week'20 | 第 2 周看点--Nebula Graph UI 内测中](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-01-10/)
  - [Pick of the Week'20 | 第 1 周看点--Nebula Graph 上 DB-Engine 图数据库榜单](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-01-03/)

本期 Pick of the Week 就此完毕，如果你对本周看点有任何建议，欢迎前去 GitHub：[https://github.com/vesoft-inc/nebula](https://0x7.me/zhihu2github) ，也欢迎在本文或者公众号后台及添加 Nebula 小助手微信号加群交流：NebulaGraphbot 

## 星云·小剧场

本文星云图讲解--《IC 342:The Hidden Galaxy 隐藏的星系》

![](https://nebula-blog.azureedge.net/nebula-blog/PotW2003Nebula.png)

大小和我们附近的明亮大螺旋星系相当的 IC 342，位于有长长脖子的鹿豹座之内，距离我们只有 1 千万光年远。IC 342 是个庞大的宇宙岛，所以本来应是我们夜空中一个很吸睛的星系，但因为受到银河系盘面的恒星、云气和尘埃之遮掩，只能隐约一窥其芳踪。

资料来源 | Robert Nemiroff (MTU) & Jerry Bonnell (UMCP), Phillip Newman (NASA);
图片来源 | Astronomy Picture of the Day | 2019 January 16

![关注公众号](https://nebula-blog.azureedge.net/nebula-blog/WeChatOffical.png)


