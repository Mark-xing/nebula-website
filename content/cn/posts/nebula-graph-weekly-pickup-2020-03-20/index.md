---
title: "Pick of the Week'20 | 第 12 周看点--Nebula csv 数据导入你该知道的事项"
date: 2020-03-20
description: "本周看点：社区用户和 Nebula Graph 官方共同发布《Nebula csv 数据导入（go-importer) 你该知道的事项》，在产品方面支持 ACL…"
tags: ["社区","产品动态"]
author: 清蒸
---

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW.png)

> 每周五 Nebula 为你播报每周看点，每周看点由本周大事件、用户问答、Nebula 产品动态和推荐阅读构成。

这是 2020 年第 12 个工作周的周五，又一周过去了你的股票还好吗？🌝 下面来和 Nebula 看看本周图数据库和 Nebula 有什么新看点~~

## 本周大事件

- Nebula csv 数据导入（go-importer) 你该知道的事项 

Nebula Graph 根据社区用户在数据导入这块遇到的问题，整理了一份数据导入 Tips 清单以便其他社区用户导入的时候使用，可有效防止踩坑 👏。论坛帖子地址：[https://discuss.nebula-graph.io/t/nebula-csv-go-importer/361](https://discuss.nebula-graph.io/t/nebula-csv-go-importer/361)

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW201201.png)

## Nebula 产品动态

Pick of the Week 每周会从 GitHub issue 及 pr 中选取重要的产品动态和大家分享，欢迎阅读本文的你关注我们的 GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula) 及时了解产品新动态~

- 支持 ACL，标签： `权限` ，pr 参见：[https://github.com/vesoft-inc/nebula/pull/1842](https://github.com/vesoft-inc/nebula/pull/1842)，角色及其对应操作权限示例如下，pr 参见：[https://github.com/vesoft-inc/nebula/pull/1929](https://github.com/vesoft-inc/nebula/pull/1929)

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW201202.png)

-  新增生产环境中使用 Nebula 的建议配置 ，标签： `配置` ，pr 参见：[https://github.com/vesoft-inc/nebula/pull/1908](https://github.com/vesoft-inc/nebula/pull/1908)

## 社区问答

Pick of the Week 每周会从官方论坛、微博、知乎、微信群、微信公众号及 CSDN 等技术社区选取 3 - 5 个用户问题同你分享，欢迎阅读本文的你通过知乎、微信公众号后台或者添加 Nebula 小助手微信号：NebulaGraphbot 进群交流。

- @sleepsfish 提问
> 有几个存储架构的问题问一下：
> 1. 因为已经提前向所有 leader partition 发送了 write blocking 请求，所以此时数据库是只读状态的。在创建 Snapshot 过程中，有数据写入是否会失败？还是会 Pending，等 Snapshot 创建成功之后，触发写？
> 2. 假设我在主集群定时创建 Snapshot 备份到备集群，主集群有三台机器，是不是对应的备份策略就是主集群的 M1 备份到备集群的 M1，主 M2 -> 备 M2，主 M3 -> 备 M3，也就是说主备需要保证机器数一致，而且数据备份在机器层面是一对一的，这样才可以通过拷贝 Snapshot 来实现主集群数据在备集群恢复，从而实现主备的切换。

**Nebula**：回答问题1，当 snapshot 开始时，会首先出发各个part leader 的 writeBlocking。在这个过程中如果有新的写入请求，将会被blocking，返回一个错误信息。直到 Snapshot 过程完成，才允许继续执行写请求。<br />回答问题 2，是的，生产集群需要和目标恢复集群保持相同的架构，也就是 M1->M1,M2->M2, M3->M3。

- @Levid 提问
> Nebula Graph 的存储引擎，基于 RocksDB 加了什么能力吗？

**Nebula**：RocksDB 只是 nebula storaged 所支持的一种单机存储引擎， 目前对于一台 storaged， 可以管理多个 rocksdb instance（每块盘一个 instance）， 多个 storaged 之间， 利用 RAFT 实现数据的多副本强一致。

另外，nebula storaged 还支持 space 概念， 不同的 space 之间数据隔离， 使用不同的 RocksDB instance。

- @图DB初学者-那月真美 提问
> 请问一下各位大佬，nebula-java 中 StorageService.Client，MetaService.Client 和 GraphService.Client 这三个 client 的适用场景分别是什么？主要是前面两种没怎么看懂

**Nebula**：StorageService.Client 是直接和 storaged 通信的，MetaService.Client 是和 metad 通信， GraphService.Client 是 graphd。巨大多数情况下，一般用户都是写查询语句的，所以直接用 GraphService.Client 就好。

## 推荐阅读

- [使用 Github Action 进行前端自动化发布](https://nebula-graph.io/cn/posts/github-action-automating-project-process/)
  - 推荐理由：说起自动化，无论是在公司还是我们个人的项目中，都会用到或者编写一些工具来帮助我们去处理琐碎重复的工作，以节约时间提升效率，尤其是我们做前端开发会涉及诸如构建、部署、单元测试等这些开发工作流中重复的事项，本篇文章就是介绍如何利用 GitHub 提供的 Actions 来完成我们前端的发布自动化。
- 往期 Pick of the Week
  - [Pick of the Week'20 | 第 11 周看点--图数据库的蓄水池](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-03-13/)
  - [Pick of the Week'20 | 第 10 周看点--HN 热烈讨论的图查询语言](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-03-06/)
  - [Pick of the Week'20 | 第 9 周看点--2020 H1 RoadMap 发布](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-02-28/)

本期 Pick of the Week 就此完毕，如果你对本周看点或 Nebula Graph 有任何建议，欢迎前去 GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula) 或者官方论坛：[https://discuss.nebula-graph.io/](https://discuss.nebula-graph.io/) 向我们提出。若你想加入图数据库交流群，请添加 Nebula 小助手微信：NebulaGraphbot 

## 星云·小剧场

**为什么给图数据库取名 Nebula ？**

Nebula 是星云的意思，很大嘛，也是漫威宇宙里面漂亮的星云小姐姐。对了，Nebula的发音是：[ˈnɛbjələ]

本文星云图讲解--《A Spiral Galaxy with a Strange Center：M106 有奇特核心的螺旋星系》

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW2012Nebula.jpeg)

M106 是个由螺旋盘状恒星和气体所聚成的星系，外观上的主要特征为两道明亮的螺旋臂及核心附近的黝黑尘埃带，如上面这张主题影像所示。 M106 的核心在无线电波和X射线波段都很明亮，更有 2 道源自核心、长度和星系宽度相当的喷流。

资料来源 | Robert Nemiroff (MTU) & Jerry Bonnell (UMCP), Phillip Newman (NASA);
图片来源 | Astronomy Picture of the Day | 2019 March 17

![关注公众号](https://nebula-blog.azureedge.net/nebula-blog/WeChatOffical.png)
