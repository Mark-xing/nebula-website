---
title: "Pick of the Week'20 | 第 7 周看点--Nebula 论坛上线"
date: 2020-02-14
description: "本周看点：Nebula 官方论坛上线、支持 ttl，指定数据的有效期…"
tags: ["社区","产品动态"]
author: 清蒸
---

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW.png)

> 每周五 Nebula 为你播报每周看点，每周看点由本周大事件、用户问答、Nebula 产品动态和推荐阅读构成。

这是 2020 年第 7 个工作周的周五，没有情人的情人节快乐 🌝来和 Nebula 看看本周图数据库和 Nebula 有什么新看点~~

## 本周大事件

- [Nebula 论坛上线](https://discuss.nebula-graph.io/)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200701.png)

Nebula Graph 官方论坛已上线，你可以在论坛里提 `使用问题` 、 `意见反馈` ，也可以在论坛上读到我们最新的 `技术文章` ，了解 `产品动态` 。

## Nebula 产品动态

Pick of the Week 每周会从 GitHub issue 及 pr 中选取重要的产品动态和大家分享，欢迎阅读本文的你关注我们的 GitHub：[https://github.com/vesoft-inc/nebula](https://0x7.me/zhihu2github) 及时了解产品新动态~

- 新增 `Nebula Stats Exporter` ，采集 Nebula 集群监控和性能指标信息给 Prometheus，使用 Grafana 作为可视化组件，标签： `监控` ，pr 参见链接： [https://github.com/vesoft-inc/nebula-stats-exporter/pull/2](https://github.com/vesoft-inc/nebula-stats-exporter/pull/2)
- 支持 ttl，指定数据的有效期，标签： `TTL` ，示例见下图，pr 参见链接：[https://github.com/vesoft-inc/nebula/pull/1584](https://github.com/vesoft-inc/nebula/pull/1584)、[https://github.com/vesoft-inc/nebula/pull/422](https://github.com/vesoft-inc/nebula/pull/422)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW200702.png)

- 新增 Spark 对接 Nebula Graph 的示例，标签： `OLAP` ，pr 参见链接：[https://github.com/vesoft-inc/nebula-java/pull/56](https://github.com/vesoft-inc/nebula-java/pull/56)

## 社区问答

Pick of the Week 每周会从微博、知乎、微信群、微信公众号及 CSDN 等技术社区选取 3 - 5 个用户问题同你分享，欢迎阅读本文的你通过知乎、微信公众号后台或者添加 Nebula 小助手微信号：NebulaGraphbot 进群交流。

- @vanchov（国际友人） 提问

> 我注意到 Nebula 的 repo 里有 3 个 Docker 镜像，分别是 nebula-web-docker, nebula-graph-studio, 和 nebula-web-console, 请问这三者有什么区别呢？

**Nebula**：实际上 nebula-web-console 是已经被废弃的镜像，感谢指正！nebula-graph-studio 是最新的 Docker 镜像。

- @Lull 提问

> 请问下 Nebula 中的 partition 是多大

**Nebula**：部署集群时需要设置 Partition 数，比如 1000 个 Partition。插入某个点时，会针对这个点的id做 Hash，找寻对应的 Partition 和对应 Leader。PartitionID 计算公式 = VertexID % num_Partition

单个 Partition 的大小，取决于总数据量和 Partition 个数；Partition 的个数的选择取决于集群中最大可能的机器节点数，Partition 数目越大，每个 Partition 数据量越小，机器间数据量不均匀发生的概率也就越小。

- @loong 提问

> 请问如何查 tag 里的所有点？不知道 vid 的情况下能查 tag 里的点吗？

**Nebula**：Java 客户端目前有 scan 的接口可以不知道 vid 的情况下获取某个 tag 所有点，C++ / console 还不支持该功能。

## 推荐阅读

- [前端 Docker 镜像体积优化](https://nebula-graph.io/cn/posts/how-to-reduce-docker-image-size/)
  - 推荐理由：如果 2019 年技术圈有十大流行词，容器化肯定占有一席之地，随着 Docker 的风靡，前端领域应用到 Docker 的场景也越来越多，本文主要来讲述下开源的分布式图数据库 Nebula Graph 是如何将 Docker 应用到可视化界面中，并将 1.3G 的 Docker 镜像优化到 0.3G 的实践经验。
- 往期 Pick of the Week
  - [Pick of the Week'20 | 第 6 周看点--DB-Engine 2 月图数据库排名发榜](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-02-07/)
  - [Pick of the Week'20| 第 3 周看点--Nebula Graph Studio 来了](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-01-17/)
  - [Pick of the Week'20 | 第 2 周看点--Nebula Graph UI 内测中](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-01-10/)

本期 Pick of the Week 就此完毕，如果你对本周看点有任何建议，欢迎前去 GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula) ，也欢迎在本文或者公众号后台及添加 Nebula 小助手微信号加群交流：NebulaGraphbot 

## 星云·小剧场

**为什么给图数据库取名 Nebula ？**

Nebula 是星云的意思，很大嘛，也是漫威宇宙里面漂亮的星云小姐姐。对了，Nebula的发音是：[ˈnɛbjələ]

本文星云图讲解--《IC 1805: The Heart Nebula 心脏星云》

![](https://nebula-blog.azureedge.net/nebula-blog/PotW2007Nebula.jpeg)

心脏星云最明亮的部分（右方区域）另外编号为 NGC 896，因为该区域是心脏星云最早被观测到的部分。

心脏星云的艳红色和它的形状是由星云中心附近一小群恒星发射出的辐射而形成。这个被称为 Melotte 15 的疏散星团包含了数颗质量接近太阳 50 倍的高光度恒星，而大多较暗恒星质量则低于太阳。该星团曾经有一个微类星体，但在 100 万年前离开了该区域。

资料来源 | Robert Nemiroff (MTU) & Jerry Bonnell (UMCP), Phillip Newman (NASA);
图片来源 | Astronomy Picture of the Day | 2009 February 14

![关注公众号](https://nebula-blog.azureedge.net/nebula-blog/WeChatOffical.png)
