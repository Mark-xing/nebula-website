---
title: "Pick of the Week'20 | 第 11 周看点--图数据库的蓄水池"
date: 2020-03-13
description: "本周看点：支持蓄水池算法，实现 User Manager，集成了 coverage testing tool…"
tags: ["社区","产品动态"]
author: 清蒸
---

![每周看点](https://nebula-blog.azureedge.net/nebula-blog/PotW.png)

> 每周五 Nebula 为你播报每周看点，每周看点由本周大事件、用户问答、Nebula 产品动态和推荐阅读构成。

这是 2020 年第 11 个工作周的周五，本周的股市像使用了蓄水池算法一般随机地跌涨。 🌝 下面来和 Nebula 看看本周图数据库和 Nebula 有什么新看点~~

## 本周大事件

- 蓄水池算法

图数据库在社交网络等业务场景中会遇到 "超级大点" 问题，点的边可能有千万条，业务往往只需要 K 条就能满足其算法精度。Nebula 支持 Reservoir Sampling，在只遍历一遍数据，时间复杂度 O(N) 的情况下，随机的抽取 K 个元素，每个元素被抽取的概率都是 K/N，并且空间复杂度 O(K)。

蓄水池算法的使用方法：在 storage 配置文件中设置 `enable_reservoir_sampling`  为 true 打开开关采样开关， `max_edge_returned_per_vertex`  配置采样数，示例如下，pr 参见链接：[https://github.com/vesoft-inc/nebula/pull/1746](https://github.com/vesoft-inc/nebula/pull/1746)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW201101.png)

## Nebula 产品动态

Pick of the Week 每周会从 GitHub issue 及 pr 中选取重要的产品动态和大家分享，欢迎阅读本文的你关注我们的 GitHub：[https://github.com/vesoft-inc/nebula](https://0x7.me/zhihu2github) 及时了解产品新动态~

- 实现 User Manager， `CREATE USER`  创建用户，目前有 `GOD` , `ADMIN` , `DBA` , `GUEST` 等四种角色权限。 `GRANT ROLE`  赋予某用户某权限， `REVOKE ROLE`  撤销已赋予给某用户的权限 ,   标签： `权限` ，pr 参见：[https://github.com/vesoft-inc/nebula/pull/1842](https://github.com/vesoft-inc/nebula/pull/1842)
- 支持离线 rebuild index，可以对数据库中已有数据建立索引，标签： `INDEX` ，示例如下，pr 参见链接：[https://github.com/vesoft-inc/nebula/pull/1566](https://github.com/vesoft-inc/nebula/pull/1566)
stream/master

```bash
REBUILD {TAG | EDGE} INDEX <index_name> [OFFLINE]
```

- 集成了 coverage testing tool，标签： `CI/CD` ，示例如下，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1856](https://github.com/vesoft-inc/nebula/pull/1856)

![](https://nebula-blog.azureedge.net/nebula-blog/PotW201102.png)

-  利用 Helm 简化了 Nebula 在 Kubernetes 上的部署，标签： `k8s` ，pr 参见链接： [https://github.com/vesoft-inc/nebula/pull/1473](https://github.com/vesoft-inc/nebula/pull/1473)

## 社区问答

Pick of the Week 每周会从官方论坛、微博、知乎、微信群、微信公众号及 CSDN 等技术社区选取 3 - 5 个用户问题同你分享，欢迎阅读本文的你通过知乎、微信公众号后台或者添加 Nebula 小助手微信号：NebulaGraphbot 进群交流。

- @Céline 提问
> 为什么下面的语言执行失败，查询不到结果？

![](https://nebula-blog.azureedge.net/nebula-blog/PotW201103.png)

**Nebula**： `LOOKUP` 语法使用是正确的，但 LOOKUP 之前需要创建索引，如果你未创建索引的话是查询不到结果的。创建好索引之后，可使用`SHOW TAG INDEXES` 查看索引是否创建成功。

- @王伟 提问
> Nebula 支持插入部分属性值吗？

**Nebula**：支持设置默认值，比如有边 serve (name string, grade int DEFAULT 20)
插入的时候 `INSERT EDGE serve(name) VALUES 100 -> 200:(”hello“)` ;如果没有默认值，以下语句是会报错 `INSERT EDGE serve(name) VALUES 100 -> 200:(”hello“)` 。

- @cloud 提问
> 各位大佬，请教一下，我看到官方 GitHub  Nebula Graph Studio 在 macOS 上的安装方法，而且还要装一个 Chrome，想问下，是否有可视化的前端服务呢？我的 Nebula Graph 装在 Linux 服务器，然后想把 Nebula Graph Studio 也安装在服务器上提供远程访问。

**Nebula**：Nebula Graph Studio 目前也可以在 Linux上安装使用的，如果你不用数据导入功能，可以安装在远程服务器上使用的，Linux 安装 Chromium 之后访问的话，通过 ip:7001 在本地浏览器能打开页面即可。

## 推荐阅读

- [分布式图数据库 Nebula Graph 的 Index 实践](https://nebula-graph.io/cn/posts/how-indexing-works-in-nebula-graph/)
  - 推荐理由：索引是数据库系统中不可或缺的一个功能，数据库索引好比是书的目录，能加快数据库的查询速度，其实质是数据库管理系统中一个排序的数据结构。不同的数据库系统有不同的排序结构，目前常见的索引实现类型如 B-Tree index、B+-Tree index、B*-Tree index、Hash index、Bitmap index、Inverted index 等等，各种索引类型都有各自的排序算法，在本文中 Nebula Graph 解析了下图数据库中的索引。
- 往期 Pick of the Week
  - [Pick of the Week'20 | 第 10 周看点--HN 热烈讨论的图查询语言](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-03-06/)
  - [Pick of the Week'20 | 第 9 周看点--2020 H1 RoadMap 发布](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-02-28/)
  - [Pick of the Week'20 | 第 8 周看点--索引、属性查询已上线](https://nebula-graph.io/cn/posts/nebula-graph-weekly-pickup-2020-02-21/)

本期 Pick of the Week 就此完毕，如果你对本周看点或 Nebula Graph 有任何建议，欢迎前去 GitHub：[https://github.com/vesoft-inc/nebula](https://github.com/vesoft-inc/nebula) 或者官方论坛：[https://discuss.nebula-graph.io/](https://discuss.nebula-graph.io/) 向我们提出。若你想加入图数据库交流群，请添加 Nebula 小助手微信：NebulaGraphbot 

## 星云·小剧场

**为什么给图数据库取名 Nebula ？**

Nebula 是星云的意思，很大嘛，也是漫威宇宙里面漂亮的星云小姐姐。对了，Nebula的发音是：[ˈnɛbjələ]

本文星云图讲解--《The Central Magnetic Field of the Cigar Galaxy 雪茄星系》

![](https://nebula-blog.azureedge.net/nebula-blog/PotW2011Nebula.png)

位于大熊座方向、双筒望远镜可见的雪茄星系，距离我们约 1 千 2 百万光年远。

资料来源 | Robert Nemiroff (MTU) & Jerry Bonnell (UMCP), Phillip Newman (NASA);
图片来源 | Astronomy Picture of the Day | 2019 March 11

![关注公众号](https://nebula-blog.azureedge.net/nebula-blog/WeChatOffical.png)
