---
title: "Pick of the Week'20 | 第 2 周看点--Nebula Graph UI 内测中"
date: 2020-01-10
description: "本周看点：Nebula Graph UI 1.0 版本内测中、Index 支持点边属性创建索引…"
tags: ["社区","产品动态"]
author: 清蒸
---

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW.png)

> 每周五 Nebula 为你播报每周看点，每周看点由本周大事件、用户问答、Nebula 产品动态和推荐阅读构成。

这是 2020 年第 2 个工作周的周五，距离阖家欢乐的春节还有 2 周不到的时间。来和 Nebula 看下本周图数据库和 Nebula 有什么新看点~~

## 本周大事件

### Nebula Graph UI 1.0 版本内测中
在本版本中你可以使用 GUI 来连接图数据库 Nebula Graph 服务，进行创建 Schema，数据导入并进行图探索。内测体验地址：[https://github.com/vesoft-inc/nebula-web-docker](https://github.com/vesoft-inc/nebula-web-docker)，搭配使用文档使用更佳：[https://github.com/vesoft-inc/nebula-web-docker/blob/master/nebula-graph-studio-user-guide.md](https://github.com/vesoft-inc/nebula-web-docker/blob/master/nebula-graph-studio-user-guide.md)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200201.png)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200203.png)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200202.png)

BTW，欢迎联系 Nebula 小助手参与测试哟 😊 

### Index 支持点边属性创建索引

Index Storage、Query Engine 已实现，支持对点边的属性建立索引，**显示所有索引**，**查看索引详情**、**删除索引**等操作，索引使用见下图，pr 参见 [https://github.com/vesoft-inc/nebula/pull/1360](https://github.com/vesoft-inc/nebula/pull/1360)、[https://github.com/vesoft-inc/nebula/pull/1459](https://github.com/vesoft-inc/nebula/pull/1459)、[https://github.com/vesoft-inc/nebula/pull/1598](https://github.com/vesoft-inc/nebula/pull/1598)，BTW，如果你试用 Index 过程中遇到任何问题，欢迎联系 nbot（Wechat：NebulaGraphbot ），我们会第一时间解决的~  

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200204.png)

## Nebula 产品动态

Pick of the Week 每周会从 GitHub issue 及 pr 中选取重要的产品动态和大家分享，欢迎阅读本文的你关注我们的 GitHub：[https://github.com/vesoft-inc/nebula](https://0x7.me/zhihu2github) 及时了解产品新动态~

- 删除  Tag / Edgetype / Space 时，支持 `IF EXISTS` 关键字。如果已存在 Tag / Edgetype / Space 则直接删除，不存在则直接返回。 标签： `Schema` ，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1505](https://github.com/vesoft-inc/nebula/pull/1505)
- Spark Writer 数据导入支持异步写入，并且提供 Hash，uuid 函数，标签： `数据导入` ，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1405](https://github.com/vesoft-inc/nebula/pull/1405)

## 社区问答

Pick of the Week 每周会从微博、知乎、微信群、微信公众号及 CSDN 等技术社区选取 3 - 5 个用户问题同你分享，欢迎阅读本文的你通过知乎、微信公众号后台或者添加 Nebula 小助手微信号：NebulaGraphbot 进群交流。

- @不能倒流的时光 提问
> Nebula 对图进行分片的时候，直接采用 hash 是没有考虑图的邻近性么？

**Nebula**：图分片是 NP 复杂的，所以对于在线系统事前分割是很难的。目前是在在 key 的设计上，有考虑点和对应边的局限性，这样访问速度会比较快。 

- @李本利 提问
> 能说下 Nebula 在 RocksDB 这块做的优化吗？


**Nebula**：在 RocksDB 这块我们主要做了一些参数调整等操作，我们后续有机会会结合在做的几个项目详细讲解下这块的优化。

- @〒宸〒 提问
> 查询点和边的记录数，命令是如何写的呢？


**Nebula**：有个离线工具，dump_tool，[https://github.com/vesoft-inc/nebula/pull/1479](https://github.com/vesoft-inc/nebula/pull/1479)，相关文档 pr 还没有 merge，文档 pr [https://github.com/vesoft-inc/nebula/pull/1554/files](https://github.com/vesoft-inc/nebula/pull/1554/files)。CLI 上的功能还在设计中，这个略微还要点时间。

- @西瓜 提问
> 目前 nebula 有工业界实际使用案例吗？貌似还没支持 ACID？

**Nebula**：Nebula 目前在多家互联网巨头的业务场景落地，场景涉及社交、金融、数据、知识图谱等等。Nebula Graph 支持同分区数据的 ACID，跨分区的暂时未能支持。如果呼声大的话，会提高跨分区 ACID 开发任务的优先级。BWT，大家觉得对于很大规模的图结构，分布式的 ACID 是很核心的需要吗，哪怕为此会导致其他性能受影响？👏 欢迎大家在微信后台或者在图数据库交流群交流下这个问题的看法

## 推荐阅读

- [Jepsen 测试框架在图数据库 Nebula Graph 中的实践](https://nebula-graph.io/cn/posts/practice-jepsen-test-framework-in-nebula-graph/)
  - 推荐理由：能否通过 Jepsen 的测试已成为各个分布式数据库对自身检验的一个标杆，在本篇文章中 Nebula Graph 将详解 Jepsen 组成部分、测试流程及如何将它应用在 Nebula Graph 上，是一篇较全面的 Jepsen 实践文。
- 往期 Pick of the Week
  - [Pick of the Week'20 | 第 1 周看点--Nebula Graph 上 DB-Engine 图数据库榜单](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-01-03/)

本期 Pick of the Week 就此完毕，如果你对本周看点有任何建议，欢迎前去 GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula) ，也欢迎在本文或者公众号后台及添加 Nebula 小助手微信号加群交流：NebulaGraphbot 

## 星云·小剧场

**为什么给图数据库取名 Nebula ？**
Nebula 是星云的意思，很大嘛，也是漫威宇宙里面漂亮的星云小姐姐。对了，Nebula的发音是：[ˈnɛbjələ]

本文星云图讲解--《Astronomy Picture of the Day：船帆座超新星遗迹》

![](https://nebula-blog.azureedge.net/nebula-blog/PotW2002Nebula.jpeg)

在这幅 16 度宽视野，由 200 张照片拼贴成，远眺船帆座西北缘缤纷恒星的影像，中心处有船帆座超新星遗迹的明亮云气丝，而这团气体是一颗大质量恒星爆炸死亡后所留下的扩张碎片云。产生船帆座遗迹的超新星爆炸亮闪，大约在 11,000 年前传到地球。这次的爆炸，除了激震出明亮的云气丝之外，也产生了一颗无比致密、高速旋转名为船帆座波霎的恒星核。

资料来源 | Robert Nemiroff (MTU) & Jerry Bonnell (UMCP), Phillip Newman (NASA);
图片来源 | Astronomy Picture of the Day | 2019 January 10

![关注公众号](https://nebula-blog.azureedge.net/nebula-blog/WeChatOffical.png)
