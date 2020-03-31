---
title: "Pick of the Week'20 | 第 9 周看点--2020 H1 RoadMap 发布"
date: 2020-02-28
description: "本周看点：Nebula Graph 2020 上半年 RoadMap 发布、Devs 24 小时在官方论坛 On call…"
tags: ["社区","产品动态"]
author: 清蒸
---

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW.png)

> 每周五 Nebula 为你播报每周看点，每周看点由本周大事件、用户问答、Nebula 产品动态和推荐阅读构成。

这是 2020 年第 9 个工作周的周五，杭州来了一波小升温和大降温，你那天气如何？🌝 来和 Nebula 看看本周图数据库和 Nebula 有什么新看点~~

## 本周大事件

- 2020 H1 RoadMap

图数据库 Nebula Graph 2020 上半年 Roadmap 发布，现已同步到官方论坛 `Announcements` 板块。

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200901.png)

- Nebula Graph 论坛正式上线

两周前的 Pick of the Week（简称 PotW）我们宣布 Nebula Graph 论坛上线，经过 2 周的公测之后我们正式上线了，在论坛默认页、分类等方面做了优化。

此外，Nebula Graph 论坛在正式上线之后 7*24 有专门的 Dev 来第一时间解答你的提问，如果你有使用方面的问题，欢迎去 `Users` 分类下向我们的 Dev 们提问，在 `Announcements` 下你可以看最新的产品动态及 Roadmap，在 `Blog` 分类下可以读到我们 Dev 最新力作，Enjoy it~ Link：[https://discuss.nebula-graph.io/](https://discuss.nebula-graph.io/)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200902.png)

最后，有任何建议和反馈， `Site Feedback` 我们在等你🎊

## Nebula 产品动态

Pick of the Week 每周会从 GitHub issue 及 pr 中选取重要的产品动态和大家分享，欢迎阅读本文的你关注我们的 GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula) 及时了解产品新动态~

- `Lookup` 提供 Storage Engine 的查询性能，标签： `benchmarking` ，示例如下，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1738](https://github.com/vesoft-inc/nebula/pull/1738)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200903.png)

```
=====================================================
 src/storage/test/StorageLookupBenchmark.cpprelative  time/iter  iters/s
 =====================================================
 PreciseScan_10000                                          9.65ms   103.65
 PreciseScan_100                                            5.23ms   191.03
 PreciseScan_10                                             4.14ms   241.64
 FilterScan_10                                              1.47s  679.35m
 =====================================================
```

- 创建 Space 支持指定 charset 和 collate，标签： `图空间` ，示例如下，pr 参见链接：[https://github.com/vesoft-inc/nebula/pull/1709](https://github.com/vesoft-inc/nebula/pull/1709)

```
nebula> CREATE SPACE my_space_4(partition_num=10, replica_factor=1, charset = utf8, collate = utf8_bin);
```

- Partitions 提供扫描的性能，标签： `benchmarking` ，pr 参见链接：[https://github.com/vesoft-inc/nebula/pull/1807](https://github.com/vesoft-inc/nebula/pull/1807)

## 社区问答
Pick of the Week 每周会从官方论坛、微博、知乎、微信群、微信公众号及 CSDN 等技术社区选取 3 - 5 个用户问题同你分享，欢迎阅读本文的你通过知乎、微信公众号后台或者添加 Nebula 小助手微信号：NebulaGraphbot 进群交流。

- @loong 提问
> 生产部署 Nebula 对机器配置有什么要求？

**Nebula**：至少 SSD 硬盘（机械盘不行），在网络方面建议万兆网，以 AWS EC2 为例，推荐机型是 c5d.12xlarge 及以上。

- @pafador 提问
> 已知点的属性值，怎样才能返回这个点的 ID？

**Nebula**：这需要使用 Nebula 的索引功能。

```
CREATE {TAG | EDGE} INDEX [IF NOT EXISTS] <index_name> ON {<tag_name> | <edge_name>} (prop_name_list)
LOOKUP ON {<vertex_tag> | <edge_type>} WHERE <expression> [ AND | OR expression ...]) ] [YIELD <return_list>]
```
比如，一个名为 **entity** 的 tag， 它包含两个属性，**name** 和 **age**。如果希望查询 **name** 为 **Amber** 的点的 ID，则可以使用如下方式：<br />首先，创建 **entity** 索引：
```
CREATE TAG entity(name string, age int);
CREATE TAG INDEX entity_index ON entity(name, age);
INSERT VERTEX entity(name, age) VALUES 101:("Amber", 21);
LOOKUP ON entity WHERE entity.name == "Amber";
============
| VertexID |
============
| 101      |
------------
```
如果不使用 YIELD 指定返回结果， Nebula 默认返回点 ID。<br />**注意：**

1. 先创建 tag， 然后创建索引。
1. 索引创建好后再插入数据，因为 rebuild index 目前还没支持。

- @ymin 提问
> 数据迁移会影响线上速度吗？ 做 balance data 会不会对读写速度有影响，有没有什么建议？

**Nebula**：balance 过程中涉及到 raft leader 切换, 会导致部分分区在切换过程中无法写, 另外在 balance 过程中按 batch 发送 snapshot 等, 会占用磁盘/内存/网络资源, 都可能会影响线上速度。

## 推荐阅读

- [Kubernetes 部署 Nebula 图数据库集群](https://nebula-graph.io/cn/posts/how-to-deploy-nebula-graph-in-kubernetes/)
  - 推荐理由：数据库容器化是最近的一大热点，Kubernetes 能给数据库带来故障恢复、存储管理、负载均衡、水平拓展等好处。而它在图数据库 Nebula Graph 中可以发挥什么作用呢？希望本文能给你一个满意的答案。
- 往期 Pick of the Week
  - [Pick of the Week'20 | 第 8 周看点--索引、属性查询已上线](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-02-21/)
  - [Pick of the Week'20 | 第 7 周看点--Nebula 论坛上线](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-02-14/)
  - [Pick of the Week'20 | 第 6 周看点--DB-Engine 2 月图数据库排名发榜](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-02-07/)

本期 Pick of the Week 就此完毕，如果你对本周看点有任何建议，欢迎前去 GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula) ，也欢迎在本文或者公众号后台及添加 Nebula 小助手微信号加群交流：NebulaGraphbot 

## 星云·小剧场

**为什么给图数据库取名 Nebula ？**

Nebula 是星云的意思，很大嘛，也是漫威宇宙里面漂亮的星云小姐姐。对了，Nebula的发音是：[ˈnɛbjələ]

本文星云图讲解--《Magnetic Orion 猎户座大星云的磁场》

![](https://nebula-blog.azureedge.net/nebula-blog/PotW2009Nebula.jpeg)

影像中，隐约可见的猎户座克莱曼-楼星云，出现在中右上方，而四边形星团的亮星，则在中央偏左之处。 距离约 l,300 光年的猎户座大星云，是离太阳最近的大型恒星形成区。

资料来源 | Robert Nemiroff (MTU) & Jerry Bonnell (UMCP), Phillip Newman (NASA);
图片来源 | Astronomy Picture of the Day | 2019 February 27

![关注公众号](https://nebula-blog.azureedge.net/nebula-blog/WeChatOffical.png)
