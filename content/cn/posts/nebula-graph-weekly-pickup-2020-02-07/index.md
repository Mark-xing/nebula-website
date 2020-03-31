---
title: "Pick of the Week'20 | 第 6 周看点--DB-Engine 2 月图数据库排名发榜"
date: 2020-02-07
description: "本周看点：DB-Engine 2020 年 2 月图数据库趋势发布…"
tags: ["社区","产品动态"]
author: 清蒸
---

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW.png)

> 每周五 Nebula 为你播报每周看点，每周看点由本周大事件、用户问答、Nebula 产品动态和推荐阅读构成。

这是 2020 年第 6 个工作周的周五，也是在家办公的第一周，可还习惯？🌝和 Nebula 看看本周图数据库和 Nebula 有什么新看点~~

## 本周大事件

- [DB-Engine 2020 年 2 月图数据库趋势](https://db-engines.com/en/ranking/graph+dbms)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200601.png)

整体上来说图数据库的排名变大并不大，前九名席位基本固定，新晋第十名是时态数据库 FaunaDB，而这次排名 Nebula Graph 表现也不错上升到了 21 名 👏👏

- RC3 release note

本次 RC3 主要新增 `dump_tools` 工具，导出指定条件的数据；发布 GUI 工具 Nebula Graph Studio，支持可视化探索，数据导入等功能；新增扫描点边接口，对接 OLAP。

## Nebula 产品动态
Pick of the Week 每周会从 GitHub issue 及 pr 中选取重要的产品动态和大家分享，欢迎阅读本文的你关注我们的 GitHub：[https://github.com/vesoft-inc/nebula](https://0x7.me/zhihu2github) 及时了解产品新动态~

- 支持将集合运算的结果赋值给变量，标签： `Storage Engine` ，示例如下，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1572](https://github.com/vesoft-inc/nebula/pull/1572)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200602.png)

- 优化了多步关系查询的性能，标签： `nGQL` ，pr 参见链接：[https://github.com/vesoft-inc/nebula/pull/1471](https://github.com/vesoft-inc/nebula/pull/1471)
- storage client 增加了预热功能，标签： `Client` ，pr 参见链接：[https://github.com/vesoft-inc/nebula/pull/1627](https://github.com/vesoft-inc/nebula/pull/1627)
- 在出边和入边存储边属性，极大地提高反向查询性能，标签： `优化` ，pr 参见链接：[https://github.com/vesoft-inc/nebula/pull/1717](https://github.com/vesoft-inc/nebula/pull/1717)
- 添加了关于编译的 FAQ，标签： `文档` ，pr 参见链接：[ttps://github.com/vesoft-inc/nebula/pull/1671](https://github.com/vesoft-inc/nebula/pull/1671)

## 社区问答
Pick of the Week 每周会从微博、知乎、微信群、微信公众号及 CSDN 等技术社区选取 3 - 5 个用户问题同你分享，欢迎阅读本文的你通过知乎、微信公众号后台或者添加 Nebula 小助手微信号：NebulaGraphbot 进群交流。

- @周游提问
> 怎么查询边或者查询值满足特定条件的节点呢？例如，所有关系是队友，或者年龄大于 20 的所有人

**Nebula**：Match (p1:player)-[r:teammate]-(p2:player) Return p1,r,p2 这样的查询吗？如果是的话，暂时还不支持。目前遍历都需要从点开始。但是如果有球队这样的节点，在构建 schema 时，可以先查找球队，然后查找球员。（这是因为索引这个功能还没合并进去）

> 追问：我想定位所有 player(name,age) 中 age 属性大于 30 的节点该怎么操作？

**Nebula**：我看 PR 还没合进去，语法应该是 LOOKUP xxx where age >30

- @Zafar Ansari （国际友人）提问
> 为什么 Nebula Graph 选择 RocksDB 作为默认后端存储，而不是更省内存的 KV store？运行 Nebula  需要的最小 RAM 是多少？可以配置 RocksDB 内存缓存吗？

**Nebula**：Nebula 在目前版本上选择 RocksDB 作为默认后端存储是因为现阶段开发团队专注于构建合适的图数据库逻辑，但是，从设计上讲，后端存储是可外接的，理论上讲，每个图空间都可以使用自己的 KV store。未来我们会支持更省内存的 KV store。另外我在我 4GB 的笔记本上也能跑 Nebula，partiton 数量设置成 10。

- @foreigner 提问
> Nebula 是否支持图数据硬盘压缩？

**Nebula**：支持。因为 Nebula  的默认后端存储是 RocksDB，因此默认的压缩工具是 Snappy。

- @周游 提问
> 可以让 FIND 搜索路径的结果直接返回每条边的信息吗，还是要 FIND 完后再用 fetch 再搜索一遍?

**Nebula**：现在 find path 语句不支持返回属性。如果要取属性，就是你说的再执行一次 fetch

## 推荐阅读

- [图数据库设计实践 | 存储服务的负载均衡和数据迁移](https://nebula-graph.io/cn/posts/nebula-graph-storage-banlancing-data-migration/)
  - 推荐理由：数据迁移及负载均衡是评估数据库性能的重要指标之一，在本篇文章中，分布式图数据库 Nebula Graph 将分享存储层如何实现数据和服务的负载平衡。
- [从天津百货大楼 5 病例“迷局”见新冠病毒传播路径](https://nebula-graph.io/cn/posts/detect-corona-virus-spreading-with-graph-database/)
  - 推荐理由：天津某百货大楼内部相继出现 5 例新冠肺炎确诊病例，从起初的 3 个病例来看，似乎找不到任何流行病学上的关联性。在这种背景之下，作为技术人员可以通过什么技术来找寻病例之间的联系呢？本文讨论了一种可行方案，带大家一起探讨疫情的传播路径，并找到相关的疑似病例。
- 往期 Pick of the Week
  - [Pick of the Week'20| 第3周看点--Nebula Graph Studio 来了](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-01-17/)
  - [Pick of the Week'20 | 第 2 周看点--Nebula Graph UI 内测中](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-01-10/)
  - [Pick of the Week'20 | 第 1 周看点--Nebula Graph 上 DB-Engine 图数据库榜单](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-01-03/)

本期 Pick of the Week 就此完毕，如果你对本周看点有任何建议，欢迎前去 GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula) ，也欢迎在本文或者公众号后台及添加 Nebula 小助手微信号加群交流：NebulaGraphbot 

## 星云·小剧场

**为什么给图数据库取名 Nebula ？**

Nebula 是星云的意思，很大嘛，也是漫威宇宙里面漂亮的星云小姐姐。对了，Nebula的发音是：[ˈnɛbjələ]

本文星云图讲解--《Fox Fur, Unicorn, and Christmas Tree 狐皮、独角兽与圣诞树》

![](https://nebula-blog.azureedge.net/nebula-blog/PotW2006Nebula.png)

昏暗的麒麟座内，这片令人浮想联翩的多彩星野里，到处都是光亮的氢气云。这个距离约 2,700 光年远、由宇宙云气和尘埃聚成的恒星形成区，编录号为NGC 2264；它内部交织着被新恒星高能星光激发出的泛红发射星云与及黝黑的星际尘埃云。

资料来源 | Robert Nemiroff (MTU) & Jerry Bonnell (UMCP), Phillip Newman (NASA);
图片来源 | Astronomy Picture of the Day | 2019 February 07

![关注公众号](https://nebula-blog.azureedge.net/nebula-blog/WeChatOffical.png)
