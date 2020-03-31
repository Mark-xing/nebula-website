---
title: "Pick of the Week'20 | 第 8 周看点--索引、属性查询已上线"
date: 2020-02-21
description: "本周看点：索引和属性查询已上线，可根据属性查询符合条件的点…"
tags: ["社区","产品动态"]
author: 清蒸
---

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW.png)

> 每周五 Nebula 为你播报每周看点，每周看点由本周大事件、用户问答、Nebula 产品动态和推荐阅读构成。

这是 2020 年第 8 个工作周的周五，据说下周有一波复工潮，你是当中一员吗？ 🌝来和 Nebula 看看本周图数据库和 Nebula 有什么新看点~~

## 本周大事件

- 索引和属性查询已上线

根据属性查询符合条件的点，pr 参见链接：[https://github.com/vesoft-inc/nebula/pull/1705](https://github.com/vesoft-inc/nebula/pull/1705)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200801.png)

## Nebula 产品动态
Pick of the Week 每周会从 GitHub issue 及 pr 中选取重要的产品动态和大家分享，欢迎阅读本文的你关注我们的 GitHub：[https://github.com/vesoft-inc/nebula](https://0x7.me/zhihu2github) 及时了解产品新动态~

- 新增 job manager，管理长时间运行任务。目前已经支持 flush 和 compact 任务。支持 start/stop/list/recover job，其中 `recover job` 可将失败的任务重新添加到执行队列中，标签： `任务调度` ，示例如下图，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1424](https://github.com/vesoft-inc/nebula/pull/1424)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200802.png)

- 当 `Drop Index` 命令执行后，由 compaction 完成 GC。标签： `index` ，pr 参见链接：[https://github.com/vesoft-inc/nebula/pull/1776](https://github.com/vesoft-inc/nebula/pull/1776)

## 社区问答
Pick of the Week 每周会从微博、知乎、微信群、微信公众号及 CSDN 等技术社区选取 3 - 5 个用户问题同你分享，欢迎阅读本文的你通过知乎、微信公众号后台或者添加 Nebula 小助手微信号：NebulaGraphbot 进群交流。

- @justc 提问
> Nebula 是如何处理 ID 冲突问题的？

**Nebula**：由于业务千变万化，所以当初我们决定把如何产生 vid 交个业务来决定。vid 是一个 64 位整数，在你的 case 里，如果 id 不足 64 位，那就可以用 2-4 bit 来表示不同的类型，这样就把原来可能冲突的 id 分到了不同的空间。如果原来的 id 已经是 64bit 的了，那可以做 hash，把真实 id 保存在属性里。

- @xchick 提问
> 该怎么理解 Nebula Graph partition？

**Nebula**：partition 是个逻辑概念，主要目的是为了一个 partition 内的数据可以一起迁移到另外一台机器。partition 数量是由创建图空间时指定的 partition_num 确立。而单副本 partition 的分布规则如下

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200803.png)

通过算子：partID%engine_size，而多副本的情况，原理类似，follower 在另外两个机器上。

- @Zafar Ansari （国际友人）提问
> 为什么 Nebula Graph 选择 RocksDB 作为默认后端存储，而不是更省内存的 KV store？运行 Nebula  需要的最小 RAM 是多少？可以配置 RocksDB 内存缓存吗？

**Nebula**：Nebula 在目前版本上选择 RocksDB 作为默认后端存储是因为现阶段开发团队专注于构建合适的图数据库逻辑，但是，从设计上讲，后端存储是可外接的，理论上讲，每个图空间都可以使用自己的 KV store。未来我们会支持更省内存的 KV store。另外我在我 4GB 的笔记本上也能跑 Nebula，partiton 数量设置成 10。

## 推荐阅读

- [应用 AddressSanitizer 发现程序内存错误](https://nebula-graph.io/cn/posts/introduction-to-google-memory-detect-tool-addresssanitizer/)
  - 推荐理由：作为 C/ C++ 工程师，在开发过程中会遇到各类问题，最常见便是内存使用问题，比如，越界，泄漏。过去常用的工具是 Valgrind，但使用 Valgrind 最大问题是它会极大地降低程序运行的速度，初步估计会降低 10 倍运行速度。而 Google 开发的 AddressSanitizer 这个工具很好地解决了 Valgrind 带来性能损失问题，它非常快，只拖慢程序 2 倍速度。
- 往期 Pick of the Week
  - [Pick of the Week'20 | 第 7 周看点--Nebula 论坛上线](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-02-14/)
  - [Pick of the Week'20 | 第 6 周看点--DB-Engine 2 月图数据库排名发榜](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-02-07/)
  - [Pick of the Week'20| 第 3 周看点--Nebula Graph Studio 来了](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-01-17/)

本期 Pick of the Week 就此完毕，如果你对本周看点有任何建议，欢迎前去 GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula) ，也欢迎在本文或者公众号后台及添加 Nebula 小助手微信号加群交流：NebulaGraphbot 

## 星云·小剧场

**为什么给图数据库取名 Nebula ？**

Nebula 是星云的意思，很大嘛，也是漫威宇宙里面漂亮的星云小姐姐。对了，Nebula的发音是：[ˈnɛbjələ]

本文星云图讲解--《Reflections on vdB 9 反射星雲》

![](https://nebula-blog.azureedge.net/nebula-blog/PotW2008Nebula.png)

在这幅取景佳妙的天体静物画里，美丽泛蓝的 vdB 9，是范登伯(Sidney van den Bergh)在 1966 年编录的反射星云表之第九号天体。在这张涵盖大约 2 个满月宽度天空的望远镜影像里，它有北天仙后座里的恒星和不透光暗尘埃云为伴。由于尘埃反射来自炽热恒星仙后座 SU(SU Cas)的大量蓝光，让 vdB 9 带着反射星云的特征泛蓝色泽

资料来源 | Robert Nemiroff (MTU) & Jerry Bonnell (UMCP), Phillip Newman (NASA);
图片来源 | Astronomy Picture of the Day | 2019 February 21

![关注公众号](https://nebula-blog.azureedge.net/nebula-blog/WeChatOffical.png)
